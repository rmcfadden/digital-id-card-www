var modelInspector = require("./model_inspector");
var mysql = require("mysql");
var uuid = require("node-uuid");

var queryGenerator  = function()
{
	this.model = null;

	this.generateSelect = function(criteria)
	{
		this.initializeAssert();
		
		var inspector =  this.getModelInspector();
		var sql_text = "select ";

		var fields = inspector.getEffectiveFields();

		for(i=0; i< fields.length; i++)
		{
			var field = fields[i];
			var fieldName = this.mapSourceFieldNameToDestinationFieldName(field);
			
			sql_text  += fieldName + ",";

		}
		sql_text = sql_text.substring(0, sql_text.length - 1);		
		sql_text  += " from " + inspector.getPluralizedName();


		if(criteria)
			sql_text += " " + this.generateWhereClause(criteria);		

		return sql_text;
	}


	this.generateWhereClause = function(where)
	{
		this.initializeAssert();

		if(!where)
			throw new Error("where argument cannot be null");
	
		return "where " + this.generateCriteria(where);
	}

	
	// Maybe move this to a different class?
	this.generateCriteria = function(criteria )
	{
		return this.internalGenerateCriteria(criteria, "=");	
	}


	this.internalGenerateCriteria = function(criteria )
	{
		if(!criteria)
			throw new Error("criteria argument cannot be null");

		var inspector =  this.getModelInspector();	
		return this.internalGetExpressionText(criteria);
	}


	this.internalGetExpressionText = function(lvalue, rvalue, operator, inspector)
	{
		var returnText = "";
		if(!inspector)
			inspector =  this.getModelInspector();

		if(!operator)
			operator = "=";
		
		if(lvalue == "gt" || lvalue == "lt" || lvalue == "lte" ||  lvalue == "gte" ||  lvalue == "ne")
		{
			if(lvalue == "gt")
				operator = ">";

			if(lvalue == "gte")
				operator = ">=";

			if(lvalue == "lt")
				operator = "<";

			if(lvalue == "lte")
				operator = "<=";

			if(lvalue == "lte")
				operator = "<=";

			if(lvalue == "ne")
				operator = "<>";

			returnText += this.internalGetExpressionText(rvalue, null, operator)
		}
		else if(lvalue == "in")
		{	
			returnText += "in ( ";

			for(var i=0; i < rvalue.length; i++)
			{	
			
				var val = rvalue[i];
			
				if(typeof val === "string")				
					returnText += "'" + mysql.escape(val)  + "'";
				else
					returnText += val;
				
				if(i != (rvalue.length - 1))
					returnText += ",";
		
			}

			returnText += " )";
		}		
		else if(typeof lvalue === "string" && this.isPrimitive(rvalue))
		{
			var field = inspector.getEffectiveFieldFromName(lvalue);
			if(!field)
				throw Error("Cannot find field for value: " + lvalue);
		
			rvalue = this.getConvertedValue(field, rvalue)
			returnText += this.mapSourceFieldNameToDestinationFieldName(field) + " " + operator + " " + rvalue;
		}
		else if(Object.prototype.toString.call( rvalue ) === "[object Array]")
		{
			if(rvalue.length > 0)
			{
				returnText += "( ";

				for(var i=0; i < rvalue.length; i++)
				{	
					var val = rvalue[i];
				
					returnText += this.internalGetExpressionText(val);
				
					if((i < rvalue.length - 1) && (lvalue == "or" || lvalue == "and" || lvalue == "not") )
					{	
						returnText += " " + lvalue + " ";
					}
		
				}

				returnText += " )";
			}

		}		
		else if(typeof lvalue === "object")
		{
			var attributes = [];
			var areAllPrimitives = true;
			for(var attribute in lvalue)
			{
				if (lvalue.hasOwnProperty(attribute)) 
					attributes.push(attribute);

				if(!this.isPrimitive(lvalue[attribute]))
					areAllPrimitives = false;
			}

			
			if(attributes.length > 0)
			{
				if(areAllPrimitives && attributes.length > 1)
					returnText += "(";

				for(var i=0; i < attributes.length; i++)
				{
					var attribute = attributes[i];	

					var criteriaText = this.internalGetExpressionText(attribute,lvalue[attribute], operator, inspector);
					returnText += criteriaText;

					if(i < attributes.length - 1)
					{
						// look ahead
						attribute = attributes[i + 1];
						if(this.internalGetExpressionText(attribute,lvalue[attribute], operator, inspector) != "")										
							returnText += " and ";
					}				
				}

				if(areAllPrimitives && attributes.length > 1)
					returnText += ")";

			}

		}
		else if(typeof rvalue === "object")
		{
			returnText += this.internalGetExpressionText(rvalue, null, operator);
		}

		return returnText;
		
	}

	this.isPrimitive = function(val)
	{
		return ((typeof val === "number") || (typeof val === "boolean") || (typeof val === "string") || (typeof val === "object" && val == null))	
	}
	

	this.generatePrimaryKeyWhereClause = function(obj)
	{
		if(!obj)
			throw new Error("obj argument cannot be null");

		var inspector =  this.getModelInspector();
		var keyFields = inspector.getPrimaryKeyFields();

		if(keyFields.length < 1)
			throw new Error("No primary keys found in generatePrimaryKeyWhereClause");

		var keyName = keyFields[0].name;			
		var fieldValue = this.getFieldValue(keyFields[0], obj);

		var obj = {};
		obj[keyName] = fieldValue;

		return this.generateWhereClause(obj);
	}


	this.generateCreate = function(obj)
	{
		if(!obj)
			throw new Error("obj argument cannot be null");

		this.initializeAssert();

		var inspector =  this.getModelInspector();
		var sql_text = "insert into " + inspector.getPluralizedName() + " (";

		var fields = inspector.getEffectiveFields();

		for(i=0; i< fields.length; i++)
		{
			var field = fields[i];

			if(this.shouldIgnoreFieldForCreate(field))
				continue;

			var fieldName = this.mapSourceFieldNameToDestinationFieldName(field);
			sql_text  += fieldName + ",";
		}
		sql_text = sql_text.substring(0, sql_text.length - 1);
		sql_text  += ") values("


		for(i=0; i< fields.length; i++)
		{
			var field = fields[i];
			if(this.shouldIgnoreFieldForCreate(field))
				continue;

			var fieldValue = this.getFieldValue(field, obj);		

			sql_text  += fieldValue + ","
		}
		sql_text = sql_text.substring(0, sql_text.length - 1);
		sql_text += ")";


		return sql_text;
	}


	this.generateUpdate = function(obj, args)
	{
		if(!obj)
			throw new Error("obj argument cannot be null");

		this.initializeAssert();

		var inspector =  this.getModelInspector();
		var sql_text = "update " + inspector.getPluralizedName() + " set ";

		var fields = inspector.getEffectiveFields();

		if(args && args.set)
		{
			for(var i=0; i< fields.length; i++)
			{
				var field = fields[i];
				for(var setArg in args.set)
				{
					if(setArg == field.name)
					{
						var setObj = {};
						setObj[setArg] = args.set[setArg];

						sql_text += this.generateCriteria(setObj);
						sql_text += ","
					}
				}
			}			
		}
		else
		{
			for(i=0; i< fields.length; i++)
			{
				var field = fields[i];
	
				if(this.shouldIgnoreFieldForUpdate(field))
					continue;
	
				var fieldName = this.mapSourceFieldNameToDestinationFieldName(field);
				var fieldValue = this.getFieldValue(field, obj);		


				sql_text  += fieldName + " = " + fieldValue + ",";
			}
		}

		if(sql_text[sql_text.length - 1] == ",")		
			sql_text = sql_text.substring(0, sql_text.length - 1);

		if(args && args.where)
		{
			sql_text += " " + this.generateWhereClause(args.where);
		}
		else
			sql_text += " " + this.generatePrimaryKeyWhereClause(obj);


		return sql_text;
	}


	this.generateRemove = function(args)
	{
		if(!args)
			throw new Error("args argument cannot be null");

		this.initializeAssert();

		var inspector =  this.getModelInspector();
		var sql_text = "delete from " + inspector.getPluralizedName();
		sql_text += " " + this.generateWhereClause(args);

		return sql_text;
	}


	this.initializeAssert = function()
	{
		if(!this.model)
			throw new Error("model cannot be null");	

		if(!this.model.name)
			throw new Error("model.name cannot be null");
	}


	this.getModelInspector = function()
	{
		var Inspector = new modelInspector();
		Inspector.model = this.model;
		
		return Inspector;
	}


	this.shouldIgnoreFieldForCreate = function(field)
	{
		if(field == null)
			throw new Error("field cannot be null");

		if(field.is_read_only && field.is_read_only === true)
			return true;

		if(field.is_primary_key && field.is_primary_key === true)
			return true;
		
		return false;
	}


	this.shouldIgnoreFieldForUpdate = function(field)
	{
		var shouldIgnoreForCreate = this.shouldIgnoreFieldForCreate(field);
		if(shouldIgnoreForCreate)
			return true;

		if(field.can_update != null && !field.can_update)
			return true;

		return false;
	}


	this.mapSourceFieldNameToDestinationFieldName  = function(field)
	{
		if(field == null)
			throw new Error("field cannot be null");

		return field.name;
	}


	this.getFieldValue = function(field, obj)
	{
		if(field == null)
			throw new Error("field cannot be null");

		if(obj == null)
			throw new Error("obj cannot be null");



		var doesPropertyExist = obj.hasOwnProperty(field.name);
		var doesDefaultValueExist = obj.hasOwnProperty(field.default);

		if(!doesPropertyExist && doesDefaultValueExist)
			throw new Error("field " + field.name + " not provided and no default value is defined");
	
		var fieldValue = null;
		if(doesPropertyExist)
			fieldValue =  this.getConvertedFieldValue(field, obj); 
		else
			fieldValue = this.getConvertedFieldDefaultValue(field);

		
		return fieldValue;
	}


	this.getConvertedFieldValue = function(field, obj)
	{
		if(field == null)
			throw new Error("field cannot be null");	

		var fieldValue = obj[field.name]

		return this.getConvertedValue(field, fieldValue);

	}


	this.getConvertedValue = function(field, val)
	{
		if(field == null)
			throw new Error("field cannot be null");

		if(field.type == "string")
			return mysql.escape(val);

		if(field.type == "datetime")
			return mysql.escape(val);

		if(field.type == "uuid")
			return "UNHEX(REPLACE(" + mysql.escape(val) + ",'-',''))";

		if(field.type == "int" || field.type == "long" || field.type == "tiny" || field.type == "small" || field.type == "decimal")
		{	
			if(!isNaN(parseFloat(val)) && isFinite(val))
				return val;
		}


		return mysql.escape(val);
	}


	this.getConvertedFieldDefaultValue = function(field)
	{
		if(field == null)
			throw new Error("field cannot be null");

		if(field.default == null)
			return null;

		if(!field.type)
			return field.default;

		if(field.type == "datetime" && field.default == 'minimum')
			return "'1000-01-01 00:00:00'"; 

		if(field.type == "datetime" && field.default == 'utcnow')
			return "utc_timestamp()";

		if(field.type == "uuid" && field.default == 'newid')
			return "uuid()";

		
		if(field.type == "string")
			return "'" +  field.default + "'";
		
		return field.default;
	}
}


module.exports = queryGenerator;

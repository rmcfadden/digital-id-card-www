var inflection = require("./inflection");
var deepcopy = require("deepcopy");

var modelInspector = function()
{
	this.model = null;
	this.isCaseSensitive = false;

	this.getName = function()
	{
		this.AssertModel();	
		return this.model.name;
	}


	this.getPluralizedName = function()
	{
		this.AssertModel();	

		var name = this.getName();

		if(this.model.pluralizedName)
			return this.model.pluralizedName;

		return inflection.pluralize(name);
	}


	this.getFields = function()
	{
		this.AssertModel();

		if(!this.model.fields)
			return [];

		return deepcopy(this.model.fields);		
	}


	this.getEffectiveFieldsHash = function()
	{
		var fields = this.getEffectiveFields();
		
		var returnObject = {};

		for(i=0; i< fields.length; i++)
		{
			var field = fields[i];
		
			returnObject[field.name] = field;	
		}

		return returnObject;
	
	}


	this.getEffectiveFields = function()
	{
		this.AssertModel();

		var returnFields = this.getFields();

		if(this.containsConvention("standard_object"))
		{

			var idField = 
			{
				"name" : "id",
				"type" : "long",
				"is_primary_key" : true
			};

			var uuidField = 
			{
				"name" : "uuid",
				"type" : "uuid",
				"default"  : "newid",
				"can_update" : false

			};

			var dateAddedField = 
			{
				"name" : "date_added",
				"type" : "datetime",
				"default" : "utcnow",
				"can_update" : false
			};

			var lastModifiedField = 
			{
				"name" : "last_modified",
				"type" : "timestamp",
				"is_read_only" : true
			};

	
			returnFields.unshift(uuidField);
			returnFields.unshift(idField);
			returnFields.push(dateAddedField);
			returnFields.push(lastModifiedField);

		}
	
		return returnFields;				
	}


	this.getEffectiveFieldFromName = function(fieldName)
	{
		var fields = this.getEffectiveFields();

		for(i=0; i< fields.length; i++)
		{
			var field = fields[i];
			if(field.name  == fieldName)
				return field;
		
		}

		return null;
	}


	this.getPrimaryKeyFields = function()
	{
		var fields = this.getEffectiveFields();
		var returnFields = [];


		for(i=0; i< fields.length; i++)
		{
			var field = fields[i];
		
			if(field.is_primary_key)
				returnFields.push(field);	
		}

		return returnFields;
	}

	
	
	this.getConventions = function()
	{
		this.AssertModel();	

		if(!this.model.conventions)
			return [];

		return this.model.conventions;
	}


	this.containsConvention = function(conventionName)
	{
		this.AssertModel();

		if(conventionName == null)
			throw new Error("conventionName cannot be null");

		if(conventionName == "")
			throw new Error("conventionName cannot be empty");
		
		var conventionNameToLower = conventionName.toLowerCase();

		var conventions =  this.getConventions();
		for(var i in conventions)
		{
			var convention = conventions[i];
			if(convention.toLowerCase() == conventionNameToLower)
				return true;
		}	

		return false;
	}



	this.AssertModel = function()
	{
		if(!this.model)
			throw new Error("model cannot be null");	

		if(!this.model.name)
			throw new Error("model name cannot be null");	

		if(this.model.name == "")
			throw new Error("model name cannot be empty");
	}	

}

module.exports = modelInspector;

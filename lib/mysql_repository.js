var queryGenerator = require("./mysql_query_generator");
var modelInspector = require("./model_inspector");
var uuid = require("node-uuid");

var string = require("./string");
var moment = require("moment");
var dateTime = require("./date_time");


var mysql = require("mysql");
var Type = require("type-of-is")

var cache = require("./cache");
var currentCache = new cache();

var mysqlRepository  = function()
{
	this.model = null;
	this.connectionInfo = null;
	this.shouldDebugSql = false;
	
	this.findAll = function(callback)
	{
		var inspector =  this.getModelInspector();
		if(inspector.containsConvention("lookup_object"))
		{
			var proxyThis = this;
			currentCache.get(inspector.getName() + "_lookup_object", function(error, results)
			{
				if(results)
				{
					callback(error, results);
					return;
				}
				else
				{
					return proxyThis.find(null, callback);
				}
			});
		}
		else
			return this.find(null, callback);	
	}




	this.find = function(args, callback)
	{
		if(!this.initializeAssert(callback))
			return;
	

		var proxyThis = this;
		this.createConnection(function(error, connection)
		{

			if(error)
			{
				callback(proxyThis.getConnectionError(error));
				return;	
			}	

	
			var generator = proxyThis.createQueryGenerator();

			var sql = generator.generateSelect(args);

			var currentThis = proxyThis;
			proxyThis.internalRunQuery(sql, connection, function(error, results)
			{

				if(error)
				{
					callback(currentThis.getConnectionError(error));
					return;	
				}

				currentThis.postProcessReadResults(results);


				// Cached lookup for lookup_object.  Only FindAll supported
				var inspector =  currentThis.getModelInspector();
				if(!args && inspector.containsConvention("lookup_object"))
				{
					currentCache.set(inspector.getName() + "_lookup_object", results, function(error)
					{
						if(callback)
							callback(error, results);
		
						connection.release();
					});
				}
				else
				{

					if(callback)
						callback(error, results);

					connection.release();
				}
			});
		});
	}


	this.findById = function(id, callback)
	{
		if(id == null)
		{
			callback("id cannot be null");
			return;
		}

		var inspector =  this.getModelInspector();
		var fields = inspector.getPrimaryKeyFields();
		if(fields.length == 0)
		{
			callback("cannot find an primary key fields");
			return;
		}

		if(inspector.containsConvention("lookup_object"))
		{
			this.findAll(function(error, results)
			{
				if(error)
				{
					callback(error);
					return;				
				}
		
				if(results)
				{
					for(i=0; i < results.length; i++)
					{
						var result = results[i];
						if(result[fields[0].name] == id)
						{	
							callback(null, [result]);
							return;						
						}					
					}
					
					callback(null, []);			
				}						
			});
		}
		else
		{
			var obj = {};
			obj[fields[0].name] = id;

			this.find(obj, callback);
		}
	}



	this.findByName = function(name, callback)
	{
		if(name == null)
		{
			callback("name cannot be null");
			return;
		}

		var inspector =  this.getModelInspector();
		if(inspector.containsConvention("lookup_object"))
		{
			this.findAll(function(error, results)
			{
				if(error)
				{
					callback(error);
					return;				
				}
		
				if(results)
				{
					for(i=0; i < results.length; i++)
					{
						var result = results[i];
						if(result.name == name)
						{	
							callback(null, [result]);
							return;						
						}					
					}
					
					callback(null, []);			
				}						
			});
		}
		else
		{
			this.find({ "name" : name }, callback);
		}
	}


	this.getNamesLookup = function(callback)
	{
		this.findAll(function(error, results)
		{
			if(error)
			{
				callback(error, null);
				return;
			}

			var returnObj = {};

			for(var i=0; i < results.length; i++)
			{
				var result = results[i];
				returnObj[result.name.toLowerCase()] = result.id;				
			}

			

			callback(null, returnObj);
		});
	}



	this.create = function(obj, callback)
	{
		if(!this.initializeAssert(callback))
			return;

		var proxyThis = this;
		this.createConnection(function(error, connection)
		{		
			if(error)
			{
				callback(this.getConnectionError(error));
				return;	
			}	


			var generator = proxyThis.createQueryGenerator();

			var sql = generator.generateCreate(obj);
	
			proxyThis.internalRunQuery(sql, connection, callback);
			connection.release();
		});
	}


	this.update = function(obj, callback)
	{
		this.updateBy(obj, null, callback);
	}


	this.updateBy = function(obj, args, callback)
	{
		if(obj == null)
		{
			callback("obj cannot be null");
			return;		
		}

		if(!this.initializeAssert(callback))
			return;

		var proxyThis = this;
		proxyThis.createConnection(function(error, connection)
		{		
			if(error)
			{
				callback(this.getConnectionError(error));
				return;	
			}	


			var generator = proxyThis.createQueryGenerator();

			var sql = generator.generateUpdate(obj, args);

			proxyThis.internalRunQuery(sql, connection, callback);
			connection.release();
		});
	}


	this.remove = function(obj, callback)
	{
		this.removeBy({ id: obj.id }, callback); 
	}

	
	this.removeBy = function(args, callback)
	{

		if(!this.initializeAssert(callback))
			return;
	

		var proxyThis = this;
		proxyThis.createConnection(function(error, connection)
		{		
			if(error)
			{
				callback(this.getConnectionError(error));
				return;	
			}	

			var generator = proxyThis.createQueryGenerator();


			var sql = generator.generateRemove(args);


			proxyThis.internalRunQuery(sql, connection, callback);
			connection.release();
		});
	}


	this.getConnectionError = function(error)
	{
		return "Error creating connection: " + error;
	}



	this.internalRunQuery = function(sql, connection, callback)
	{			

		if(this.shouldDebugSql || process.env.NODE_ENV == "test")
			console.log(sql);

		if(sql.text  && sql.values)
		{
			connection.query(sql.text, sql.values, function(error, results) 
			{
				if(callback)
					callback(error, results);
			});		
		}
		else
		{
			connection.query(sql, function(error, results) 
			{
			
				if(callback)
					callback(error, results);
			});		
		
		}

	}


	this.createDynamicMethods = function()
	{
		var inspector =  this.getModelInspector();
		var fields = inspector.getEffectiveFields();

		for(i=0; i< fields.length; i++)
		{
			var field = fields[i];

	
			// findByName
			var findByName = "findBy" + field.name.capitalize();				
			if(this[findByName] == null && (typeof this[findByName] !== "function"))
			{
				var proxyThis = this;
				this[findByName] = function(field)
				{
					return function(val, callback) 
					{ 
						var obj = {};
						obj[field.name] = val;
						proxyThis.find(obj, callback);
					}
				}(field);
			}
	


			// updateSetField
			var updateSetField = "updateSet" + field.name.capitalize();	

			if(this[updateSetField] == null && (typeof this[updateSetField] !== "function"))
			{
				var proxyThis = this;
				this[updateSetField] = function(field)
				{
					return function(obj, val, callback) 
					{ 
						var setObj = {};
						setObj[field.name] = val;
	
						proxyThis.updateBy(obj, { "set" :  setObj  }, callback);
					}
				}(field);
			}

		}
	}


	this.postProcessReadResults = function(results)
	{
		if(results.length == 0)
			return [];

		// Maps:
		// bool fields (1 => true, 0 => false)
		// uuid buffers to a hex readable string
		// datetime and timestamp converted to date object
	
		var inspector =  this.getModelInspector();

		var fields = inspector.getEffectiveFields();

		var boolFields = {};
		var uuidFields = {};
		var dateTimeFields = {};


		for(i=0; i< fields.length; i++)
		{
			var field = fields[i];
			if(field.type == "bool")
			{	
				boolFields[field.name] = field;
			}			

			if(field.type == "uuid")
			{	
				uuidFields[field.name] = field;
			}	

			if(field.type == "datetime" || field.type == "timestamp")
			{	
				dateTimeFields[field.name] = field;
			}	

		}


		if((Object.keys(boolFields).length == 0)  && (Object.keys(uuidFields).length == 0)  && (Object.keys(dateTimeFields).length == 0) )
			return;

		for(i=0; i < results.length; i++)
		{
			var result = results[i];
			
			for(var field in boolFields)
			{
				if(result.hasOwnProperty(field))
				{
					if(result[field] == 1)
						result[field] = true;				

					if(result[field] == 0)
						result[field] = false;
				}
			}

			for(var field in uuidFields)
			{
				if(result.hasOwnProperty(field))
				{
					result[field] = uuid.unparse(result[field]);
				}
			}

			for(var field in dateTimeFields)
			{
				if(result.hasOwnProperty(field))
				{
					result[field] = moment(result[field]).utc().format();
				}
			}


		}
				
	}


	this.initializeAssert = function()
	{
		if(!this.model)
		{
			callback("model cannot be null");	
			return false;
		}

		if(!this.model.name)
		{
			callback("model.name cannot be null");
			return false;
		}

		return true;
	}


	this.createConnection = function(callback)
	{
		if(!this.connectionInfo)
			throw new Error("connectionInfo cannot be null");

		var pool = mysql.createPool(
		{
			host     : this.connectionInfo.host,
			database : this.connectionInfo.database,
        		user     : this.connectionInfo.user,
 	      		password : this.connectionInfo.password,
			supportBigNumbers : true,
			timezone : 'Z'

		});

		pool.getConnection(callback);


	}


	this.getModelInspector = function()
	{
		var Inspector = new modelInspector();
		Inspector.model = this.model;
		
		return Inspector;
	}

	this.createQueryGenerator = function()
	{
		var generator = new queryGenerator();
		generator.model = this.model;	

		return 	generator;
	}


};

module.exports = mysqlRepository;


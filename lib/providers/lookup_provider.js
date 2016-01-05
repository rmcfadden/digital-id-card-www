var config = require("../../config");

var mongo = require("mongodb");
 
var Server = mongo.Server;
var Db = mongo.Db;
var BSON = mongo.BSONPure;
 

var async = require("async");


var lookupProvider = function()
{
	this.dBName = "loaded";
	this.db = null;

	this.isConnectionOpen = false;

	this.get = function(collectionName, query, callback)
	{
		if(!collectionName)
		{
			callback("collectionName parameter cannot be empty");
			return;		
		}


		if(!query)
		{
			callback("query parameter cannot be empty");
			return;		
		}


		this.internalOpen(function(error, db)
		{
			db.collection(collectionName, function(error, collection) 
			{
				if(error)
				{
					callback(error);
					return;
				}
			
			        collection.find(query).toArray( function(error, results)
				{
					callback(null,results);
				});
			});
		});	
	}


	this.getMax = function(collectionName, column, callback)
	{
		if(!collectionName)
		{
			callback("collectionName parameter cannot be empty");
			return;		
		}


		if(!column)
		{
			callback("column parameter cannot be empty");
			return;		
		}


		this.internalOpen(function(error, db)
		{
			db.collection(collectionName, function(error, collection) 
			{
				if(error)
				{
					callback(error);
					return;
				}
			
			        collection.find({}, { "sort" : [[ column, "desc"] ],  limit: 1, safe: true}).toArray(function(error, results)
				{		
					var result = -1;
					if(results.length > 0 && !isNaN(results[0][column]))
						result = results[0][column];

					callback(error, result);
				}); 
			});	
		});
	}


	this.add = function(collectionName, item, callback)
	{
		if(!collectionName)
		{
			callback("collectionName parameter cannot be empty");
			return;		
		}


		if(!item)
		{
			callback("item parameter cannot be empty");
			return;		
		}


		this.internalOpen(function(error, db)
		{
			if(error)
			{
				callback(error);
				return;
			}
			

			db.collection(collectionName, function(error, collection) 
			{
				if(error)
				{
					callback(error);
					return;
				}
			
			        collection.insert(item, { safe: true}, function(error, result)
				{
					callback(error, result);
				}); 
			});

		});	
	}


	this.update = function(collectionName, key, item, callback)
	{
		if(!collectionName)
		{
			callback("collectionName parameter cannot be empty");
			return;		
		}


		if(!key)
		{
			callback("key parameter cannot be empty");
			return;		
		}

		if(!item)
		{
			callback("item parameter cannot be empty");
			return;		
		}

	

		this.internalOpen(function(error, db)
		{
			if(error)
			{
				callback(error);
				return;
			}
			

			db.collection(collectionName, function(error, collection) 
			{
				if(error)
				{
					callback(error);
					return;
				}
				
			        collection.update(key, { $set: item}, {}, function(error, result)
				{
					callback(error, result);
				}); 
			});

		});	
	}


	this.remove = function(collectionName, query, callback)
	{
		if(!collectionName)
		{
			callback("collectionName parameter cannot be empty");
			return;		
		}


		if(!query)
		{
			callback("query parameter cannot be empty");
			return;		
		}

		this.internalOpen(function(error, db)
		{
			db.collection(collectionName, function(error, collection) 
			{
				if(error)
				{
					callback(error);
					return;
				}
			

			        collection.remove(query, function(error, results)
				{		
					callback(error, results);
				}); 
			});	
		});

	}	


	this.internalOpen = function(callback)
	{
		if(this.isConnectionOpen)
		{
			callback();
			return;
		}

		var server = new Server(this.getHostname(), this.getPort(), { auto_reconnect: true});
		this.db = new Db(this.getDbName(), server, {safe: true });

		this.db.open(function(error, db)
		{

			if(!error && db)
				this.isConnectionOpen = true;

			callback(error, db);	
		});
	
	}


	this.setup = function(callback)
	{
		var setupInfos = 
		[
			{
				"collection": "users",
				"indexes" :
				[
					{ "user_id" : 1, "unique": true } ,
					{ "email" : 1, "unique": true }
				]			
			},
			{
				"collection": "resources",
				"indexes" :
				[
					{ "resource_id" : 1, "unique": true },
					{ "hashtag" : 1, "unique": true },
					{ "user_id" : 1 }
				]			
			},
			{
				"collection": "restrictedfiles",
				"indexes" :
				[

					{ "resource_id" : 1, "unique": true },
					{ "sha1" : 1, "unique": true }
				]			
			}

		];



		var proxyThis = this;
		async.each(setupInfos, function(setupInfo, finishedCallback) 
		{
			proxyThis.internalOpen(function(error, db)
			{	
				db.collection(setupInfo.collection, function(error, collection)
				{
					if(setupInfo.indexes  && setupInfo.indexes.length > 0)
					{					
						async.each(setupInfo.indexes, function(index, indexfinishedCallback) 
						{
							var uniqueIndex = {"unigue" : false, };
							if(index.unique === true)
							{
								uniqueIndex.unique = true;
								uniqueIndex.dropDups = true;
							}

							collection.ensureIndex(index, uniqueIndex, function(error, index)
							{
	
								indexfinishedCallback(error);
							});
						},
						function(error)
						{
							finishedCallback(error);
						});


					}
					else
						finishedCallback();

				});

				
			});
		},
		function(error)
		{
			callback(error);
		});

	}


	this.getDbName = function()
	{
		var returndBName = this.dBName;
		if(config.mongo && config.mongo.dbname)
			returndBName = config.mongo.dbname;
		
		if(process.env.NODE_ENV == "test")
			returndBName = returndBName + "_test";

		return returndBName;	
	}


	this.getHostname = function()
	{
		var returnHost = "localhost";
		if(config.mongo && config.mongo.hostname)
			returndBName = config.mongo.hostname;

		return returnHost;
	}


	this.getPort = function()
	{
		var returnPort = 27017;
		if(config.mongo && config.mongo.port)
			returnPort = config.mongo.port;

		return returnPort;
	}


}

module.exports = lookupProvider;

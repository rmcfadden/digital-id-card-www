var connectionManager = require("./connection_manager");

var repositoryFactory  = function()
{
	this.create  = function(args, callback)
	{
		if(!callback)
			throw new Error("callback cannot be null");
		
		if(!args)
		{
			callback("args cannot be null");
			return;
		}
		

		if(args.modelName)
		{
			var moduleName = "../model/" + args.modelName;
			try 
			{
    				require.resolve(moduleName);
			} 
			catch(ex) 
			{
				callback(ex.message);
				return;
			}

			args.model = require(moduleName);
		}
	

		if(!args.model)
		{
			callback("model cannot be null");
			return;
		}

		if(!args.connectionName && !args.connectionInfo)
			args.connectionName = "user";
		
	
		if(args.connectionName)
		{
			var manager = new connectionManager();

			var proxyThis = this;
			manager.getConnectionInfo({ name: args.connectionName}, function(error, connectionInfo)
			{
				if(error)
				{
					callback(error);
					return;
				}

				proxyThis.createFromModelConnectionInfo(args.model, connectionInfo, callback);
			});

			return;
		}

		if(!args.connectionInfo)
		{
			callback("connectionInfo cannot be null");
			return;		
		}

		if(!args.connectionInfo.type)
		{
			callback("connectionInfo.type must be defined");
			return;		
		}

		this.createFromModelConnectionInfo(args.model, args.connectionInfo, callback);
	}


	this.createFromModelConnectionInfo = function(model, connectionInfo, callback)
	{
		if(connectionInfo.type == "mysql")
		{
			var mysqlRepository = require("./mysql_repository");

			var repo = new mysqlRepository();
			repo.model = model;
			repo.connectionInfo = connectionInfo;
			repo.createDynamicMethods();

			callback(null, repo);
			return;
		}	

		callback("Cannot find data provider: " + connectionInfo.type);
	}

};


module.exports = repositoryFactory;


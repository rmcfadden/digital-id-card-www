var config = require("../config");

var connectionManager = function()
{
	this.getConnectionInfo = function(args, callback)
	{
		if(!callback)
			throw new Error("callback cannot be null");

		if(!args)
		{
			callback("args parameter cannot be empty");
			return;		
		}

		if(!args.name)
		{
			callback("args parameter cannot be empty");
			return;				
		}

		
		if(process.env.NODE_ENV == "test")
			args.name = args.name + "_test";

		
		if(!args.partitionId, callback)
		{
			if(!config.connections[args.name])
			{
				callback(args.name + " not found in connections");
				return;			
			}

			callback(null, config.connections[args.name] );
			return;
		}

		// TODO: shard lookup
	}		
}

module.exports = connectionManager;

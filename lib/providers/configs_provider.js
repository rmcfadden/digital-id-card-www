var repositoryFactory = require("../../lib/repository_factory.js");
var factory = new repositoryFactory();


var configsProvider = function()
{
	this.get = function(name, callback)
	{
		factory.create({modelName: "config" }, function(error, repo)
		{
			if(error)
			{
				callback(error, null);
				return;			
			}


			repo.findByName(name, function(error, results) 
			{ 
				if(error)
				{
					callback(error, null);
					return;			
				}

				
				callback(error, results);
			});
		});

	}


	this.update = function(name, value, callback)
	{
		factory.create({modelName: "config" }, function(error, repo)
		{
			if(error)
			{
				callback(error, null);
				return;			
			}


			repo.updateBy	({}, { set : { "value" : value }, where : {"name" : name } }, function(error, result) 
			{ 
				if(error)
				{
					callback(error, null);
					return;			
				}

				
				callback(error, result);
			});
		});
	}


	this.create = function(name, value, callback)
	{
		factory.create({modelName: "config" }, function(error, repo)
		{
			if(error)
			{
				callback(error, null);
				return;			
			}


			repo.create({ "name" : name, "value" : value }, function(error, result) 
			{ 
				if(error)
				{
					callback(error, null);
					return;			
				}

				
				callback(error, result);
			});
		});
	}


	this.remove = function(name, callback)
	{
		factory.create({modelName: "config" }, function(error, repo)
		{
			if(error)
			{
				callback(error, null);
				return;			
			}


			repo.removeBy({ "name" : name }, function(error, result) 
			{ 
				if(error)
				{
					callback(error, null);
					return;			
				}

				
				callback(error, result);
			});
		});
	};
}

module.exports = configsProvider;

var config = require("../../config");

var repositoryFactory = require("../repository_factory");
var factory = new repositoryFactory();

var shardsProvider = function()
{
	this.getShards = function(callback)
	{
		factory.create({ modelName: "shard" }, function(error, repo)
		{
			if(error)
			{
				callback(error);
				return;			
			}

			repo.findAll(function(error, results) 
			{
				callback(error, results);
			});
		});
	
	}


	this.getShard = function(id, callback)
	{
		if(id === null)
		{
			callback("id argument not provided");
			return;		
		}

		factory.create({ modelName: "shard" }, function(error, repo)
		{
			if(error)
			{
				callback(error);
				return;			
			}

			repo.findById(id, function(error, results) 
			{
				callback(error, results);
			});
		});
	
	}


	this.getShardInRange = function(shard_key, start, end, callback)
	{

		if(!shard_key)
		{
			callback("shard_key argument not provided");
			return;		
		}

		if(start === null)
		{
			callback("start argument not provided");
			return;		
		}


		if(end === null)
		{
			callback("end argument not provided");
			return;		
		}


		this.getShards(function(error, results)
		{
			if(error)
			{
				callback(error);
				return;			
			}

			for(var i=0; i < results.length; i++)
			{
				var result = results[i];

				if(result.shard_key == shard_key && result.start >= start && 
					result.end <= end)
				{
					callback(null, result);
					return;				
				}
							
			}

			callback(null, null);

		});
	}


	this.addShard = function(shard, callback)
	{
		factory.create({ modelName: "shard" }, function(error, repo)
		{
			if(error)
			{
				callback(error);
				return;			
			}

			repo.create(shard, function(error, results) 
			{
				callback(error, results);
			});
		});

	}


	this.createNextShard = function(shard, callback)
	{

		if(!shard)
		{
			callback("shard argument not provided");
			return;		
		}

		if(!shard.shard_key)
		{
			callback("shard_key argument not provided");
			return;		
		}


		if(!shard.connection)
		{
			callback("connection argument not provided");
			return;		
		}
		

		var proxyThis = this;
		this.getMaxShard(function(error, maxShard)
		{
			if(error)
			{
				callback(error);
				return;			
			}

			var increment = proxyThis.getShardIncrement();

			maxShard++;

			var newEnd = maxShard + increment - 1;

			var newShard = 
			{
				shard_key : shard.shard_key,
				start : maxShard,
				end : newEnd,
				connection : shard.connection,
				is_active: 0,
				is_down : 0,
				is_new_supported: 1

			};

			proxyThis.addShard(newShard, function(error, result)
			{
				callback(error, result);
			});
		});
	};	


	this.updateShard = function(shard, callback)
	{

		factory.create({ modelName: "shard" }, function(error, repo)
		{
			repo.update(shard, function(error, result) 
			{
				callback(error, result);
			});
		});

	}


	this.removeShard = function(shard, callback)
	{
		factory.create({ modelName: "shard" }, function(error, repo)
		{
			repo.remove(shard, function(error, results) 
			{
				callback(error, results);
			});
		});

	}


	this.getMaxShard = function(callback)
	{
		factory.create({ modelName: "shard" }, function(error, repo)
		{
			if(error)
			{
				callback(null, error);
				return;			
			}
			
			repo.findAll(function(error, results) 
			{
				if(error)
				{
					callback(error, null);
					return;				
				}

				if(results.length == 0)
				{
					callback(error, -1);
					return;
				}

				var maxEnd = -1;
				for(i=0; i < results.length; i++)
				{
					var result = results[i];
					if(result.end > maxEnd)
						maxEnd = result.end;
				}

				callback(null, maxEnd);
			});
		});
	}


	this.getShardIncrement = function()
	{
		return 10000000;
	}


}

module.exports = shardsProvider;

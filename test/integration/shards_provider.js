var should = require("should");

var repositoryFactory = require("../../lib/repository_factory.js");
var factory = new repositoryFactory();

var shardsProvider = require("../../lib/providers/shards_provider");
var shardsProv = new shardsProvider();

var testUtils = require("../../lib/test_utils.js");
var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();

var version = require("../../lib/version.js");
var currentVersion = new version();

describe("shardsProvider", function()
{
	it("when calling getMaxShard/createNexShard/getShard/updateShard/removeShard", function(done)
	{
		getMaxShard(function() { done(); });
	});

	


});



function getMaxShard(callback)
{	
	shardsProv.getMaxShard(function(error, result)
	{
		should.equal(result > -2, true);
		createNextShard(result, callback);
	});

}


function createNextShard(result, callback)
{
	// update the AppVersion to test clearing the cache
	currentVersion.update(function(error, version)
	{
		var shard = 
		{
			shard_key : "user_id2",
			connection : "localhost"
		};


		shardsProv.createNextShard(shard, function(error, result)
		{
			should.equal(result.insertId > 0, true);
			getShard(result.insertId, callback);
		});
	});
}


function getShard(id, callback)
{
	currentVersion.update(function(error, version)
	{
		shardsProv.getShard(id, function(error, results)
		{
			var increment = shardsProv.getShardIncrement();
		
			results.length.should.equal(1);

			var result = results[0];
			should.equal(result.id > 0, true);

			result.uuid.shouldbeUUID;
			result.shard_key.should.equal("user_id2");
			should.equal(result.start >= 0, true);
			should.equal(result.end, (result.start + increment - 1));
			result.connection.should.equal("localhost");
			result.is_active.should.equal(false);
			result.is_down.should.equal(false);
			result.is_new_supported.should.equal(true);

	
			result.date_added.shouldbeDate;
			result.last_modified.shouldbeDate;

			getShardInRange(result, callback);
		});

	});
}


function getShardInRange(result, callback)
{
	// update the AppVersion to test clearing the cache
	currentVersion.update(function(error, version)
	{
		var shard = 
		{
			shard_key : "user_id2",
			connection : "localhost"
		};


		shardsProv.getShardInRange(result.shard_key, result.start, result.end, function(error, item)
		{
			should.equal(error, null);
			should.notEqual(item, null);

			should.equal(item.id >= 0, true);

			item.uuid.shouldbeUUID;
			item.shard_key.should.equal("user_id2");
			should.equal(item.start >= 0, true);
			should.equal(item.end, result.end);
			result.connection.should.equal("localhost");
			item.is_active.should.equal(false);
			item.is_down.should.equal(false);
			item.is_new_supported.should.equal(true);
	
			item.date_added.shouldbeDate;
			item.last_modified.shouldbeDate;

			updateShard(item, callback);
		});
	});

}


function updateShard(shard, callback)
{

	shard.start = shard.start + 1;
	shard.end = shard.end + 1;
	shard.connection = "adfasdfasdf";
	shard.is_active = true;
	shard.is_down = true;
	shard.is_new_supported = false;


	shardsProv.updateShard(shard, function(error, result)
	{
		result.affectedRows.should.equal(1);
		getUpdatedShard(shard.id, callback);
	});
}


function getUpdatedShard(id, callback)
{
	currentVersion.update(function(error, version)
	{

		shardsProv.getShard(id, function(error, results)
		{		
			results.length.should.equal(1);

			var result = results[0];
			should.equal(result.id > 0, true);


			result.uuid.shouldbeUUID;
			result.shard_key.should.equal("user_id2");
			should.equal(result.start > 0, true);
			should.equal(result.end > 0, true);
			result.connection.should.equal("adfasdfasdf");
			result.is_active.should.equal(true);
			result.is_down.should.equal(true);
			result.is_new_supported.should.equal(false);
	
			result.date_added.shouldbeDate;
			result.last_modified.shouldbeDate;

			removeShard(result, callback);
		});

	});
}


function removeShard(shard, callback)
{
	shardsProv.removeShard(shard, function(error, result)
	{
		result.affectedRows.should.equal(1);
		callback();
	});
}


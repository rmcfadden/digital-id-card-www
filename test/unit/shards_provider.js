var should = require("should");


var shardsProvider = require("../../lib/providers/shards_provider");
var shardsProv = new shardsProvider();

var testUtils = require("../../lib/test_utils.js");
var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();


describe("shardsProvider", function()
{
	describe("createNextShard", function()
	{
		shardsProv.createNextShard(null, function(error, result)
		{
			error.should.equal("shard argument not provided");
		});


		shardsProv.createNextShard({}, function(error, result)
		{
			error.should.equal("shard_key argument not provided");
		});

		shardsProv.createNextShard({ shard_key: "asdf"}, function(error, result)
		{
			error.should.equal("connection argument not provided");
		});
	});


	describe("getShardIncrement", function()
	{
		var result = shardsProv.getShardIncrement();
		should.equal(result > 0, true);
	});


	describe("getShard", function()
	{
		var result = shardsProv.getShard(null, function(error, result)
		{
			error.should.equal("id argument not provided");

		});
	});


	describe("getShardInRange", function()
	{
		shardsProv.getShardInRange(null, null, null, function(error, result)
		{
			error.should.equal("shard_key argument not provided");

		});


		shardsProv.getShardInRange("adfa", null, null, function(error, result)
		{
			error.should.equal("start argument not provided");

		});


		shardsProv.getShardInRange("asdf", 1, null, function(error, result)
		{
			error.should.equal("end argument not provided");

		});

	});

});







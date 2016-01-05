var should = require("should");
var shard = require("../../model/shard.json");

var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();


describe("shard", function()
{
	it("object", function(done)
	{
		should.notEqual(shard, null);
		done();
	});


	it("name", function(done)
	{
		should.equal(shard.name, "shard");
		done();
	});


	it("conventions", function(done)
	{

		should.equal(shard.conventions[0], "standard_object");
		should.equal(shard.conventions[1], "lookup_object");

		done();
	});


	it("fields", function(done)
	{
		should.equal(shard.fields[0].name, "shard_key");
		should.equal(shard.fields[0].type, "string");
		should.equal(shard.fields[0].length, 128);

		should.equal(shard.fields[1].name, "start");
		should.equal(shard.fields[1].type, "long");

		should.equal(shard.fields[2].name, "end");
		should.equal(shard.fields[2].type, "long");

		should.equal(shard.fields[3].name, "connection");
		should.equal(shard.fields[3].type, "string");
		should.equal(shard.fields[3].length, "1024");

		should.equal(shard.fields[4].name, "is_active");
		should.equal(shard.fields[4].type, "bool");

		should.equal(shard.fields[5].name, "is_down");
		should.equal(shard.fields[5].type, "bool");

		should.equal(shard.fields[6].name, "is_new_supported");
		should.equal(shard.fields[6].type, "bool");

	
		done();
	});
});


var should = require("should");

var config = require("../../model/config.json");

var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();


describe("config", function()
{
	it("object", function(done)
	{
		should.notEqual(config, null);
		done();
	});


	it("name", function(done)
	{
		should.equal(config.name, "config");
		done();
	});

	it("conventions", function(done)
	{

		should.equal(config.conventions[0], "standard_object");
		should.equal(config.conventions[1], "lookup_object");

		done();
	});

	it("fields", function(done)
	{

		should.equal(config.fields[0].name, "name");
		should.equal(config.fields[0].type, "string");
		should.equal(config.fields[0].length, 124);


		should.equal(config.fields[1].name, "value");
		should.equal(config.fields[1].type, "string");
		should.equal(config.fields[1].length, 1024);


		done();
	});


})

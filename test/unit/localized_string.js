var should = require("should");
var localized_string = require("../../model/localized_string.json");

var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();


describe("localized_string", function()
{
	it("object", function(done)
	{
		should.notEqual(localized_string, null);
		done();
	});


	it("name", function(done)
	{
		should.equal(localized_string.name, "localized_string");
		done();
	});

	it("conventions", function(done)
	{

		should.equal(localized_string.conventions[0], "standard_object");
		should.equal(localized_string.conventions[1], "lookup_object");

		done();
	});

	it("fields", function(done)
	{
		should.equal(localized_string.fields[0].name, "localized_string_name_id");
		should.equal(localized_string.fields[0].type, "int");

		should.equal(localized_string.fields[1].name, "culture_id");
		should.equal(localized_string.fields[1].type, "int");
	
		should.equal(localized_string.fields[2].name, "value");
		should.equal(localized_string.fields[2].type, "string");
		should.equal(localized_string.fields[2].length, "512");

		done();
	});


});


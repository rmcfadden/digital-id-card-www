var should = require("should");
var localized_string_name = require("../../model/localized_string_name.json");

var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();


describe("localized_string_name", function()
{
	it("object", function(done)
	{
		should.notEqual(localized_string_name, null);
		done();
	});


	it("name", function(done)
	{
		should.equal(localized_string_name.name, "localized_string_name");
		done();
	});

	it("conventions", function(done)
	{

		should.equal(localized_string_name.conventions[0], "standard_object");
		should.equal(localized_string_name.conventions[1], "lookup_object");

		done();
	});

	it("fields", function(done)
	{
		should.equal(localized_string_name.fields[0].name, "name");
		should.equal(localized_string_name.fields[0].type, "string");
		should.equal(localized_string_name.fields[0].length, 128);

		done();
	});


});


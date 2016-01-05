var should = require("should");
var role = require("../../model/role.json");

var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();


describe("role", function()
{
	it("object", function(done)
	{
		should.notEqual(role, null);
		done();
	});


	it("name", function(done)
	{
		should.equal(role.name, "role");
		done();
	});

	it("conventions", function(done)
	{

		should.equal(role.conventions[0], "standard_object");
		should.equal(role.conventions[1], "lookup_object");

		done();
	});

	it("fields", function(done)
	{
		should.equal(role.fields[0].name, "name");
		should.equal(role.fields[0].type, "string");
		should.equal(role.fields[0].length, 256);

		done();
	});


});


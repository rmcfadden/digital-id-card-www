var should = require("should");
var role = require("../../model/users_role.json");

var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();


describe("users_role", function()
{
	it("object", function(done)
	{
		should.notEqual(role, null);
		done();
	});


	it("name", function(done)
	{
		should.equal(role.name, "users_role");
		done();
	});

	it("conventions", function(done)
	{

		should.equal(role.conventions[0], "standard_object");
		done();
	});

	it("fields", function(done)
	{
		should.equal(role.fields[0].name, "user_id");
		should.equal(role.fields[0].type, "long");

		done();
	});


});


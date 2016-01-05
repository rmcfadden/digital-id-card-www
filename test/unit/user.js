var should = require("should");
var user = require("../../model/user.json");

var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();


describe("user", function()
{
	it("object", function(done)
	{
		should.notEqual(user, null);
		done();
	});


	it("name", function(done)
	{
		should.equal(user.name, "user");
		done();
	});

	it("conventions", function(done)
	{

		should.equal(user.conventions[0], "standard_object");
		done();
	});

	it("fields", function(done)
	{

		should.equal(user.fields[0].name, "email");
		should.equal(user.fields[0].type, "string");
		should.equal(user.fields[0].length, 160);

		should.equal(user.fields[1].name, "type");
		should.equal(user.fields[1].type, "string");
		should.equal(user.fields[1].length, 128);

		should.equal(user.fields[2].name, "culture_id");
		should.equal(user.fields[2].type, "int");

		should.equal(user.fields[3].name, "time_zone_id");
		should.equal(user.fields[3].type, "int");


		should.equal(user.fields[4].name, "password");
		should.equal(user.fields[4].type, "string");
		should.equal(user.fields[4].length, 128);

		should.equal(user.fields[5].name, "password_salt");
		should.equal(user.fields[5].type, "string");
		should.equal(user.fields[5].length, 128);

		should.equal(user.fields[6].name, "is_unsubscribed");
		should.equal(user.fields[6].type, "bool");
		should.equal(user.fields[6].default, false);

		should.equal(user.fields[7].name, "is_active");
		should.equal(user.fields[7].type, "bool");
		should.equal(user.fields[7].default, false);

		should.equal(user.fields[8].name, "is_locked");
		should.equal(user.fields[8].type, "bool");
		should.equal(user.fields[8].default, false);

		should.equal(user.fields[9].name, "last_password_failed_time");
		should.equal(user.fields[9].type, "datetime");
		should.equal(user.fields[9].default, "minimum");

		should.equal(user.fields[10].name, "number_password_failed_attempts");
		should.equal(user.fields[10].type, "int");
		should.equal(user.fields[10].default, 0);


		done();
	});


});


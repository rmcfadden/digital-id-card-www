var should = require("should");
var user_key = require("../../model/user_key.json");

var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();


describe("user_key", function()
{
	it("object", function(done)
	{
		should.notEqual(user_key, null);
		done();
	});


	it("name", function(done)
	{
		should.equal(user_key.name, "user_key");
		done();
	});


	it("pluralizedName", function(done)
	{
		should.equal(user_key.pluralizedName, "user_keys");
		done();
	});

	it("conventions", function(done)
	{

		should.equal(user_key.conventions[0], "standard_object");

		done();
	});

	it("fields", function(done)
	{
		should.equal(user_key.fields[0].name, "user_id");
		should.equal(user_key.fields[0].type, "long");

		should.equal(user_key.fields[1].name, "name");
		should.equal(user_key.fields[1].type, "string");
		should.equal(user_key.fields[1].length, "128");
		should.equal(user_key.fields[1].default, "default");
	
		should.equal(user_key.fields[2].name, "public_key");
		should.equal(user_key.fields[2].type, "string");
		should.equal(user_key.fields[2].length, 4096);

		should.equal(user_key.fields[3].name, "key_length");
		should.equal(user_key.fields[3].type, "int");
		should.equal(user_key.fields[3].default, 2048);


		should.equal(user_key.fields[4].name, "passphrase");
		should.equal(user_key.fields[4].type, "string");
		should.equal(user_key.fields[4].length, 124);

		should.equal(user_key.fields[5].name, "is_expired");
		should.equal(user_key.fields[5].type, "bool");
		should.equal(user_key.fields[5].default, false);

		done();
	});
});


var should = require("should");
var user_key_challenge = require("../../model/user_key_challenge.json");


describe("user_key_challenge", function()
{
	it("object", function(done)
	{
		should.notEqual(user_key_challenge, null);
		done();
	});



	it("conventions", function(done)
	{

		should.equal(user_key_challenge.conventions[0], "standard_object");
		done();
	});


	it("fields", function(done)
	{
		should.equal(user_key_challenge.fields[0].name, "user_key_id");
		should.equal(user_key_challenge.fields[0].type, "long");

		should.equal(user_key_challenge.fields[1].name, "challenge");
		should.equal(user_key_challenge.fields[1].type, "string");
		should.equal(user_key_challenge.fields[1].length, 1024);

		should.equal(user_key_challenge.fields[2].name, "expiry_time");
		should.equal(user_key_challenge.fields[2].type, "datetime");
		should.equal(user_key_challenge.fields[2].default, "maximum");



		done();
	});


});


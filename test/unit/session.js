var should = require("should");
var session = require("../../model/session.json");


describe("session", function()
{
	it("object", function(done)
	{
		should.notEqual(session, null);
		done();
	});


	it("name", function(done)
	{
		should.equal(session.name, "session");
		done();
	});


	it("conventions", function(done)
	{

		should.equal(session.conventions[0], "standard_object");
		done();
	});


	it("fields", function(done)
	{
		should.equal(session.fields[0].name, "user_id");
		should.equal(session.fields[0].type, "long");

		should.equal(session.fields[1].name, "start_time");
		should.equal(session.fields[1].type, "datetime");
		should.equal(session.fields[1].default, "minimum");

		should.equal(session.fields[2].name, "end_time");
		should.equal(session.fields[2].type, "datetime");
		should.equal(session.fields[2].default, "minimum");

		should.equal(session.fields[3].name, "last_activity_time");
		should.equal(session.fields[3].type, "datetime");
		should.equal(session.fields[3].default, "minimum");

		should.equal(session.fields[3].name, "last_activity_time");
		should.equal(session.fields[3].type, "datetime");
		should.equal(session.fields[3].default, "minimum");

		should.equal(session.fields[4].name, "hit_count");
		should.equal(session.fields[4].type, "int");
		should.equal(session.fields[4].default, 0);

		should.equal(session.fields[5].name, "ip_address");
		should.equal(session.fields[5].type, "long");

		should.equal(session.fields[6].name, "is_expired");
		should.equal(session.fields[6].type, "bool");
		should.equal(session.fields[6].default, false);


		done();
	});


});


var should = require("should");
var time_zone = require("../../model/time_zone.json");

var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();


describe("time_zone", function()
{
	it("object", function(done)
	{
		should.notEqual(time_zone, null);
		done();
	});


	it("name", function(done)
	{
		should.equal(time_zone.name, "time_zone");
		done();
	});

	it("conventions", function(done)
	{

		should.equal(time_zone.conventions[0], "standard_object");
		should.equal(time_zone.conventions[1], "lookup_object");

		done();
	});

	it("fields", function(done)
	{

		should.equal(time_zone.fields[0].name, "name");
		should.equal(time_zone.fields[0].type, "string");
		should.equal(time_zone.fields[0].length, 64);


		should.equal(time_zone.fields[1].name, "display_name");
		should.equal(time_zone.fields[1].type, "string");
		should.equal(time_zone.fields[1].length, 64);

		should.equal(time_zone.fields[2].name, "daylight_name");
		should.equal(time_zone.fields[2].type, "string");
		should.equal(time_zone.fields[2].length, 64);

		should.equal(time_zone.fields[3].name, "utc_offset");
		should.equal(time_zone.fields[3].type, "small");

		should.equal(time_zone.fields[4].name, "adjust_for_daylight_savings");
		should.equal(time_zone.fields[4].type, "bool");

		should.equal(time_zone.fields[5].name, "daylight_savings_adjustment");
		should.equal(time_zone.fields[5].type, "small");

		done();
	});


});


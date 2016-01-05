var should = require("should");
var culture = require("../../model/culture.json");

var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();


describe("culture", function()
{
	it("object", function(done)
	{
		should.notEqual(culture, null);
		done();
	});


	it("name", function(done)
	{
		should.equal(culture.name, "culture");
		done();
	});

	it("conventions", function(done)
	{

		should.equal(culture.conventions[0], "standard_object");
		should.equal(culture.conventions[1], "lookup_object");

		done();
	});

	it("fields", function(done)
	{

		should.equal(culture.fields[0].name, "name");
		should.equal(culture.fields[0].type, "string");
		should.equal(culture.fields[0].length, 160);


		should.equal(culture.fields[1].name, "display");
		should.equal(culture.fields[1].type, "string");
		should.equal(culture.fields[1].length, 160);

		should.equal(culture.fields[2].name, "iso639_1");
		should.equal(culture.fields[2].type, "string");
		should.equal(culture.fields[2].length, 2);

		should.equal(culture.fields[3].name, "iso639_2");
		should.equal(culture.fields[3].type, "string");
		should.equal(culture.fields[3].length, 3);

		should.equal(culture.fields[4].name, "is_enabled");
		should.equal(culture.fields[4].type, "bool");

		should.equal(culture.fields[5].name, "is_visible");
		should.equal(culture.fields[5].type, "bool");

		done();
	});


})

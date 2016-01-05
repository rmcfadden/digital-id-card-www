var should = require("should");
var inflection = require("../../lib/inflection.js");
var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();

describe("Inflection", function()
{
	describe("singularize", function()
	{
		it("when param is null", function(done)
		{
			should.equal(inflection.singularize(null), null);
			done();
		});


		it("when param name ends with 'sses'", function(done)
		{
			inflection.singularize("accesses").should.equal("access");
			done();
		});


		it("when param name ends with 's'", function(done)
		{
			inflection.singularize("resources").should.equal("resource");
			done();
		});

		it("when param name ends with 'ies'", function(done)
		{
			inflection.singularize("puppies").should.equal("puppy");
			done();
		});


	});
});


describe("Inflection", function()
{
	describe("pluralize", function()
	{

		it("when param is null", function(done)
		{
			should.equal(inflection.pluralize(null), null);
			done();
		});


		it("when param name ends with 'ss'", function(done)
		{
			inflection.pluralize("class").should.equal("classes");
			done();
		});


		it("when the param names ends 'er'", function(done)
		{
			inflection.pluralize("banner").should.equal("banners");
			done();
		});

		it("when the name ends with 'y'", function(done)
		{
			inflection.pluralize("pony").should.equal("ponies");
			done();
		});


		it("when names ends with 'x'", function(done)
		{
			inflection.pluralize("hex").should.equal("hexes");
			done();

		});


		it("should add an 'es' to params that end with 's'", function(done)
		{
			inflection.pluralize("gas").should.equal("gases");
			done();
		});


		it("should add an s to the end of user", function(done)
		{
			inflection.pluralize("user").should.equal("users");
			done();
		});


	});
});

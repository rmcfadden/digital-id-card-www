var should = require("should");
var string = require("../../lib/string");


var testUtils = require("../../lib/test_utils");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();


describe("string", function()
{
	describe("capitalize", function()
	{
		it("when empty string is given", function(done)
		{
			"".capitalize().should.equal("");
			done();
		});


		it("when a single character string is given", function(done)
		{
			"a".capitalize().should.equal("A");
			done();
		});


		it("when a  normal string is given", function(done)
		{
			"ryan".capitalize().should.equal("Ryan");
			done();
		});
	});


	describe("startsWith", function()
	{
		it("when empty string is given", function(done)
		{
			"".startsWith("").should.equal(true);
			done();
		});



		it("when a valid string is given", function(done)
		{
			"testing".startsWith("test").should.equal(true);
			done();
		});


		it("when an invalid string is given", function(done)
		{
			"testing".startsWith("test1").should.equal(false);
			done();
		});

	});


	describe("endsWith", function()
	{
		it("when empty string is given", function(done)
		{
			"".endsWith("").should.equal(true);
			done();
		});



		it("when a valid string is given", function(done)
		{
			"testing".endsWith("ing").should.equal(true);
			done();
		});


		it("when an invalid string is given", function(done)
		{
			"testing".startsWith("ing1").should.equal(false);
			done();
		});

	});

});


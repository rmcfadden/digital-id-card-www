var should = require("should");
var random = require("../../lib/random.js");
var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();


describe("Random", function()
{	
	describe("getRandomText", function()
	{
		it("when length is 0", function(done)
		{
			should.equal("", random.getRandomText(0));
			done();	
		});


		it("when length is 2", function(done)
		{
			should.equal(2, random.getRandomText(2).length);
			done();	
		});


		it("when length is 4", function(done)
		{
			should.equal(4, random.getRandomText(4).length);
			done();	
		});


	});


	describe("getRandomHexText", function()
	{
		it("when length is 0", function(done)
		{
			should.equal("", random.getRandomHexText(0));
			done();	
		});


		it("when length is 2", function(done)
		{
			should.equal(2, random.getRandomHexText(2).length);
			done();	
		});


		it("when length is 4", function(done)
		{
			should.equal(4, random.getRandomHexText(4).length);
			done();	
		});

	});


});

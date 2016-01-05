var should = require("should");
var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();

var version = require("../../lib/version.js");
var currentVersion = new version();


describe("version", function()
{
	describe("getUpdatedVersion", function(done)
	{
		it("when arg is null", function(done)
		{
			should.throws( function() { currentVersion.getUpdatedVersion(null) }, Error);
			done();
		});


		it("when arg is empty", function(done)
		{
			should.throws( function() { currentVersion.getUpdatedVersion("") }, Error);
			done();
		});


		it("when arg is not formatted correctly", function(done)
		{
			should.throws( function() { currentVersion.getUpdatedVersion("asdf") }, Error);
			done();
		});


		it("when args last . is not an integer", function(done)
		{
			should.throws( function() { currentVersion.getUpdatedVersion("asdf.asd") }, Error);
			done();
		});


		it("when args is valid", function(done)
		{
			currentVersion.getUpdatedVersion("0.1.1").should.equal("0.1.2");
			done();
		});


		it("when args is valid again", function(done)
		{
			currentVersion.getUpdatedVersion("0.1.1000001").should.equal("0.1.1000002");
			done();
		});

	});


	describe("current", function(done)
	{
		it("when current is called", function(done)
		{
			currentVersion.current().should.not.equal(null);
			done();
		});
	});

		
});

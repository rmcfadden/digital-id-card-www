var should = require("should");
var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();

var cache = require("../../lib/cache");
var currentCache = new cache();

var version = require("../../lib/version");
var currentVersion = new version();


describe("cache", function()
{
	describe("get", function()
	{
		it("when arg name is null", function(done)
		{
			currentCache.get(null, function(error, result)
			{
				error.should.equal("name cannot be empty");
				done();
			});
		});
	});


	describe("set", function()
	{
		it("when arg name is null", function(done)
		{
			currentCache.set(null, null, function(error)
			{
				error.should.equal("name cannot be empty");
				done();
			});
		});
	});


	describe("set", function()
	{
		it("when arg value is undefined", function(done)
		{
			currentCache.set("asdf", undefined, function(error)
			{
				error.should.equal("value must be defined");
				done();
			});
		});
	});


	describe("set", function()
	{
		it("when currentCache.Type is not memcached", function(done)
		{
			var currentCache2 = new cache();
			currentCache2.type = "aadf";
			currentCache2.set("adf", "asdfa", function(error)
			{
				error.should.equal("only memcached is currently supported");
				done();
			});
		});
	});


	describe("get", function()
	{
		it("when the cache is not enabled", function(done)
		{
			var currentCache2 = new cache();
			currentCache2.isEnabled = false;
	
			currentCache.get("ad", function(error, result)
			{
				result.should.equal(false);
				done();
			});
		});
	});


	describe("set", function()
	{
		it("when the cache is not enabled", function(done)
		{
			var currentCache2 = new cache();
			currentCache2.isEnabled = false;
			
			currentCache2.set("asdf", undefined, function(error)
			{
				should.equal(error, null);
				done();
			});
		});
	});





	describe("internalGetName", function()
	{
		it("name is set", function(done)
		{
			var appVersion = currentVersion.current();
			currentCache.internalGetName("adf").should.equal("adf-version-" + appVersion);
			done();
	
		});		
	});

});

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
	describe("set/get", function()
	{
		it("when an object is set and get is called, then clear is called and verified by get", function(done)
		{
			currentCache.set("test", { "name" : "ryan" }, function(error)
			{
				currentCache.get("test", function(error, result)
				{

					result.should.not.equal(null);
					result.name.should.equal("ryan");

					currentCache.clear(function(error)
					{
						currentCache.get("test", function(error, result)
						{
							should.equal(result, false);
							done();
						});
					});

				});


			});
		});
	});


});

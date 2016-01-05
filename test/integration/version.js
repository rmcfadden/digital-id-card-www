var should = require("should");
var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();

var version = require("../../lib/version.js");
var currentVersion = new version();


describe("version", function()
{
	describe("current/update", function(done)
	{
		it("when current is called and then updated", function(done)
		{
			var current = currentVersion.current();

			// get the last digit	
			var lastDigit = currentVersion.getLastVersion(current);		

			currentVersion.update(function(error, result)
			{
				should.equal(error, null);

				var updateCurrent = currentVersion.current();
				var updatedlastDigit = currentVersion.getLastVersion(updateCurrent);	


				updatedlastDigit.should.equal(lastDigit + 1);

				result.version.should.equal(updateCurrent);

				done();
			});

		});
	});

		
});

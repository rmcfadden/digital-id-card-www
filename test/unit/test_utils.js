var should = require("should");
var testUtils = require("../../lib/test_utils.js");


describe("testUtils", function()
{
	it("validUUIDRegex", function(done)
	{
		
		"30306261-3062-3630-2d39-6135392d3131".shouldbeUUID;
		done();
	});


	it("shouldBeDate", function(done)
	{
		"2012-1-1 01:00:11".shouldbeDate;
		done();
	});


})

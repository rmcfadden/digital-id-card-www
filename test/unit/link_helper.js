var should = require("should");
var linkHelper = require("../../lib/link_helper.js");

var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();

describe("linkHelper", function()
{
	describe("createResourceLink", function()
	{
		it("when uuid is null", function(done)
		{
			var result = linkHelper.createResourceLink(null);
			should.equal(result, null);
			done();
		});

		it("when a valid uuid is passed", function(done)
		{
			var result = linkHelper.createResourceLink("39373165-3238-6639-2d63-3463622d3131");
			should.equal(result, "localhost/resources/39373165323866392d633463622d3131");
			done();
		});

	});


	describe("removeSlashesFromUuid", function()
	{
		it("when uuid is null", function(done)
		{
			var result = linkHelper.removeSlashesFromUuid(null);
			should.equal(result, null);
			done();
		});


		it("when a valid uuid is passed", function(done)
		{
			var result = linkHelper.removeSlashesFromUuid("39373165-3238-6639-2d63-3463622d3131");
			should.equal(result, "39373165323866392d633463622d3131");
			done();
		});


	});
});

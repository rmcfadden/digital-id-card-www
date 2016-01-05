var should = require("should");

var testUtils = require("../../lib/test_utils");
var random = require("../../lib/random");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();

var config = require("../../config");

var requestify = require("requestify"); 
var cookie = require("cookie");


describe("roles", function()
{

	before(function(done)
	{
 		testUtil.startTestServer(function(){ done(); } );
	});


	it("when roles/ and roles/:id is called", function(done)
	{
		requestify.get(testUtil.getTestUrl() + "roles").then(function(response)
		{			
			var roles = JSON.parse(response.body);
				

			(roles.items.length > 1).should.equal(true);
			roles.items[0].name.should.equal("admin");	
			roles.items[1].name.should.equal("support");	

			requestify.get(testUtil.getTestUrl() + "roles/" + roles.items[0].id).then(function(response)
			{			
				var roles = JSON.parse(response.body);
				
				roles.items.length.should.equal(1);
				roles.items[0].name.should.equal("admin");				
				done();

			});
		});

	});


	it("when roles/?name=admin and roles/:id is called", function(done)
	{
		requestify.get(testUtil.getTestUrl() + "roles/?name=support").then(function(response)
		{			
			var roles = JSON.parse(response.body);
				
			roles.items.length.should.equal(1);
			roles.items[0].name.should.equal("support");	

			

			requestify.get(testUtil.getTestUrl() + "roles/" + roles.items[0].id).then(function(response)
			{			
				var roles = JSON.parse(response.body);
				
				roles.items.length.should.equal(1);
				roles.items[0].name.should.equal("support");				
				done();

			});
		});

	});
});

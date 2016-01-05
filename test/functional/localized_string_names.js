var should = require("should");

var testUtils = require("../../lib/test_utils");
var random = require("../../lib/random");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();

var config = require("../../config");

var requestify = require("requestify"); 
var cookie = require("cookie");


describe("localized_string_names", function()
{

	before(function(done)
	{
 		testUtil.startTestServer(function(){ done(); } );
	});


	it("when localized_string_names/ and localized_string_names/:id is called", function(done)
	{
		requestify.get(testUtil.getTestUrl() + "localized_string_names").then(function(response)
		{			
			var localized_string_names = JSON.parse(response.body);


			(localized_string_names.items.length > 1).should.equal(true);
			localized_string_names.items[0].name.should.equal("test");	
			localized_string_names.items[1].name.should.equal("email");	

			requestify.get(testUtil.getTestUrl() + "localized_string_names/" + localized_string_names.items[0].id).then(function(response)
			{			
				var localized_string_names = JSON.parse(response.body);
				
				localized_string_names.items.length.should.equal(1);
				localized_string_names.items[0].name.should.equal("test");				
				done();

			});
		});

	});


	it("when localized_string_names/?name=test and localized_string_names/:id is called", function(done)
	{
		requestify.get(testUtil.getTestUrl() + "localized_string_names/?name=test").then(function(response)
		{			
			var localized_string_names = JSON.parse(response.body);
				
			localized_string_names.items.length.should.equal(1);
			localized_string_names.items[0].name.should.equal("test");	

			

			requestify.get(testUtil.getTestUrl() + "localized_string_names/" + localized_string_names.items[0].id).then(function(response)
			{			
				var localized_string_names = JSON.parse(response.body);
				
				localized_string_names.items.length.should.equal(1);
				localized_string_names.items[0].name.should.equal("test");				
				done();

			});
		});

	});
});

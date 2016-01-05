var should = require("should");

var testUtils = require("../../lib/test_utils");
var random = require("../../lib/random");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();

var config = require("../../config");

var requestify = require("requestify"); 
var cookie = require("cookie");


describe("time_zones", function()
{

	before(function(done)
	{
 		testUtil.startTestServer(function(){ done(); } );
	});


	it("when time_zones/ and time_zones/:id is called", function(done)
	{
		requestify.get(testUtil.getTestUrl() + "time_zones").then(function(response)
		{			
			var time_zones = JSON.parse(response.body);

			(time_zones.items.length > 1).should.equal(true);
			time_zones.items[0].name.should.equal("Greenwich Standard Time");		

			requestify.get(testUtil.getTestUrl() + "time_zones/" + time_zones.items[0].id).then(function(response)
			{			
				var time_zones = JSON.parse(response.body);
				time_zones.items.length.should.equal(1);
				
				var item1 = time_zones.items[0];
				item1.id.should.equal(1);				
				item1.uuid.shouldbeUUID;
				item1.name.should.equal("Greenwich Standard Time");
				item1.display_name.should.equal("(GMT) Casablanca, Monrovia, Reykjavik");				
				item1.daylight_name.should.equal("Greenwich Daylight Time");				
				item1.utc_offset.should.equal(0);				
				item1.adjust_for_daylight_savings.should.equal(false);				
				item1.daylight_savings_adjustment.should.equal(60);
				//item1.date_added.should.be.an.instanceof(Date);
				//item1.last_modified.should.be.an.instanceof(Date);			

				done();

			});
		});

	});


	it("when time_zones/?name=Ekaterinburg Standard Time and time_zones/:id is called", function(done)
	{
		requestify.get(testUtil.getTestUrl() + "time_zones/?name=" + encodeURI("Ekaterinburg Standard Time")).then(function(response)
		{			

			var time_zones = JSON.parse(response.body);			
			time_zones.items.length.should.equal(1);

			var item1 = time_zones.items[0];
			item1.id.should.equal(28);				
			item1.uuid.shouldbeUUID;
			item1.name.should.equal("Ekaterinburg Standard Time");
			item1.display_name.should.equal("(GMT+05:00) Ekaterinburg");				
			item1.daylight_name.should.equal("Ekaterinburg Daylight Time");				
			item1.utc_offset.should.equal(300);				
			item1.adjust_for_daylight_savings.should.equal(true);				
			item1.daylight_savings_adjustment.should.equal(60);
			//item1.date_added.should.be.an.instanceof(Date);
			//item1.last_modified.should.be.an.instanceof(Date);	
			

			requestify.get(testUtil.getTestUrl() + "time_zones/" + time_zones.items[0].id).then(function(response)
			{			
				var time_zones = JSON.parse(response.body);								
				time_zones.items.length.should.equal(1);


				var item1 = time_zones.items[0];
				item1.id.should.equal(28);				
				item1.uuid.shouldbeUUID;
				item1.name.should.equal("Ekaterinburg Standard Time");
				item1.display_name.should.equal("(GMT+05:00) Ekaterinburg");				
				item1.daylight_name.should.equal("Ekaterinburg Daylight Time");				
				item1.utc_offset.should.equal(300);				
				item1.adjust_for_daylight_savings.should.equal(true);				
				item1.daylight_savings_adjustment.should.equal(60);
				//item1.date_added.should.be.an.instanceof(Date);
				//item1.last_modified.should.be.an.instanceof(Date);	

				done();

			});
		});

	});
});

var should = require("should");

var testUtils = require("../../lib/test_utils");
var random = require("../../lib/random");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();

var config = require("../../config");

var requestify = require("requestify"); 
var cookie = require("cookie");


describe("cultures", function()
{

	before(function(done)
	{
 		testUtil.startTestServer(function(){ done(); } );
	});


	it("when cultures/ and cultures/:id is called", function(done)
	{
		requestify.get(testUtil.getTestUrl() + "cultures").then(function(response)
		{			
			var cultures = JSON.parse(response.body);



			(cultures.items.length).should.equal(185);
			cultures.items[0].name.should.equal("Abkhaz");		


			requestify.get(testUtil.getTestUrl() + "cultures/" + cultures.items[0].id).then(function(response)
			{			
				var cultures = JSON.parse(response.body);
				cultures.items.length.should.equal(1);
				
				var item1 = cultures.items[0];
				item1.id.should.equal(1);				
				item1.uuid.shouldbeUUID;
				item1.name.should.equal("Abkhaz");
				item1.display.should.equal("аҧсуа бызшәа, аҧсшәа");
				item1.iso639_1.should.equal("ab");
				item1.iso639_2.should.equal("abk");
				item1.is_enabled.should.equal(true);				
				item1.is_visible.should.equal(false);
				//item1.date_added.should.be.an.instanceof(Date);
				//item1.last_modified.should.be.an.instanceof(Date);			

				done();

			});
		});

	});


	it("when cultures/?name=Uyghur, Uighur and cultures/:id is called", function(done)
	{
		requestify.get(testUtil.getTestUrl() + "cultures/?name=" + encodeURI("Uyghur, Uighur")).then(function(response)
		{			

			var cultures = JSON.parse(response.body);
			cultures.items.length.should.equal(1);
			
			var item1 = cultures.items[0];
			item1.id.should.equal(170);				
			item1.uuid.shouldbeUUID;
			item1.name.should.equal("Uyghur, Uighur");
			item1.display.should.equal("Uyƣurqə, ئۇيغۇرچە‎");
			item1.iso639_1.should.equal("ug");
			item1.iso639_2.should.equal("uig");
			item1.is_enabled.should.equal(true);				
			item1.is_visible.should.equal(false);
			//item1.date_added.should.be.an.instanceof(Date);
			//item1.last_modified.should.be.an.instanceof(Date);			
		

			requestify.get(testUtil.getTestUrl() + "cultures/" + item1.id).then(function(response)
			{			

			var cultures = JSON.parse(response.body);
			cultures.items.length.should.equal(1);
			
			var item1 = cultures.items[0];
			item1.id.should.equal(170);				
			item1.uuid.shouldbeUUID;
			item1.name.should.equal("Uyghur, Uighur");
			item1.display.should.equal("Uyƣurqə, ئۇيغۇرچە‎");
			item1.iso639_1.should.equal("ug");
			item1.iso639_2.should.equal("uig");
			item1.is_enabled.should.equal(true);				
			item1.is_visible.should.equal(false);
			//item1.date_added.should.be.an.instanceof(Date);
			//item1.last_modified.should.be.an.instanceof(Date);	

				done();

			});
		});


	});
});

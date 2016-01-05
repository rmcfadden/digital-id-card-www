var should = require("should");

var testUtils = require("../../lib/test_utils");
var random = require("../../lib/random");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();

var config = require("../../config");

var requestify = require("requestify"); 
var cookie = require("cookie");



var email = random.getRandomHexText(32) + "test@test.com";
var password = random.getRandomHexText(32);

describe("users", function()
{

	before(function(done)
	{
 		testUtil.startTestServer(function(){ done(); } );
	});



	it("when create ( with email/password), name, logout, login and remove is called", function(done)
	{
		var newUser = 
		{
			email: email,
			password: password
		};

		requestify.post(testUtil.getTestUrl() + "users", newUser).then(function(response){


			response.body.should.not.equal(null);
			response.code.should.equal(200);
					
			var currrentCookie = cookie.parse(response.headers["set-cookie"][0]);

			currrentCookie.access_token.should.not.equal(null);

			var currentResponse = JSON.parse(response.body);
			currentResponse.user_id.should.not.equal(-1);
			currentResponse.access_token.should.not.equal(null);

			currentResponse.access_token.should.equal(currrentCookie.access_token);

			requestify.get(testUtil.getTestUrl() + "users/me?access_token=" + currrentCookie.access_token).then(function(response){

		
				var currentResponse = JSON.parse(response.body);

	
				currentResponse.user_id.should.not.equal(-1);
				currentResponse.access_token.should.not.equal(null);

				testLogoutUser(currentResponse, function()
				{
					requestify.get(testUtil.getTestUrl() + "users/me?access_token=" + currrentCookie.access_token).then(function(response)
					{
						var currentResponse = JSON.parse(response.body);

						currentResponse.is_success.should.equal(false);
						currentResponse.message.should.equal("session expired");
						done();
					});
				});

			});
			
		});

	});

	it("when create (with anonymous) and me and remove is called", function(done)
	{
		requestify.post(testUtil.getTestUrl() + "users", {}).then(function(response){

			response.body.should.not.equal(null);
			response.code.should.equal(200);
	
			var currentResponse = JSON.parse(response.body);
			currentResponse.user_id.should.not.equal(-1);
			currentResponse.access_token.should.not.equal(null);

			var currrentCookie = cookie.parse(response.headers["set-cookie"][0]);
			currentResponse.access_token.should.equal(currrentCookie.access_token);				

			requestify.get(testUtil.getTestUrl() + "users/me", { cookies : { access_token : currrentCookie.access_token } } ).then(function(response){

				var currentResponse = JSON.parse(response.body);

				currentResponse.user_id.should.not.equal(-1);
				currentResponse.access_token.should.not.equal(null);

				done();

			});

		});

	});

	
});


function testLogoutUser(item, callback)
{
	requestify.post(testUtil.getTestUrl() + "users/logout", {}, { cookies : { access_token : item.access_token } } ).then(function(response){

		var currentResponse = JSON.parse(response.body);

		var currentCookie = cookie.parse(response.headers["set-cookie"][0]);


		currentCookie.Path.should.equal('/');
		currentCookie.Expires.should.equal("Thu, 01 Jan 1970 00:00:00 GMT");


		currentResponse.message.should.equal("1 sessions expired");

		callback();
	
	});
}




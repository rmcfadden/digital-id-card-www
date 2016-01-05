var should = require("should");
var validator = require("validator");
var usersProvider = require("../../lib/providers/users_provider");
var random = require("../../lib/random");

var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();

var usersProv = new usersProvider();



describe("usersProvider", function()
{
	it("when calling createByEmail with valid parameters, then succesful verifyByEmailPassword/verifyByIdPassword/removeByUserId  on usersProv.", function(done)
	{
		var email = random.getRandomHexText(32) + "test@test.com";
		var password = random.getRandomHexText(32);

		usersProv.createByEmail(email, { password: password }, function(error, result)
		{
			result.user_id.should.not.equal(null);
			result.user_id.should.not.equal(-1);

			var user_id = result.user_id;
			usersProv.verifyByEmailPassword(email, password, function(error, result)
			{	
				should.notEqual(result, null);	
				result.user_id.should.equal(user_id);		
				result.is_password_valid.should.equal(true);	
				
				usersProv.verifyByIdPasswordValid(user_id, password, function(error, result)
				{	

					result.user_id.should.equal(user_id);		
					result.is_password_valid.should.equal(true);	

					usersProv.removeByUserId(user_id, function(error, result)
					{				
						result.affectedRows.should.equal(1);			
						done();
					});
				});
			});
		});
	});


	it("when calling createByAnonymous with valid parameters on on usersProv", function(done)
	{
		usersProv.createByAnonymous(function(error, result)
		{
			result.user_id.should.not.equal(null);
			result.user_id.should.not.equal(-1);

			should.equal(validator.isEmail(result.anon_id), true);

			usersProv.removeByUserId(result.user_id, function(error, result)
			{
				result.affectedRows.should.equal(1);
				done();
			});

			 
		});
	});


	it("when calling getDefaultLookupValues", function(done)
	{
		usersProv.getDefaultLookupValues(function(error, result)
		{

			result.culture_id.should.equal(41);
			result.time_zone_id.should.equal(2);
			result.type.should.equal("power");

			done();

		});
	});


});


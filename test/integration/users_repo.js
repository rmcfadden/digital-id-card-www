var should = require("should");
var random = require("../../lib/random");
var testUtils = require("../../lib/test_utils");
var deepcopy = require("deepcopy");

var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();


var repositoryFactory = require("../../lib/repository_factory");
var factory = new repositoryFactory();

var usersProvider = require("../../lib/providers/users_provider");
var usersProv = new usersProvider();


var email = random.getRandomHexText(32) + "test'@test.com";
var password = random.getRandomHexText(32);
var password_salt = random.getRandomHexText(16);
var number_password_failed_attempts = 25;

var newUser = 
{ 
	email : email, 
	password : password, 
	password_salt: password_salt,
	is_unsubscribed : false,
	is_active : false,
	is_locked : false,
	last_password_failed_time: "2014-1-1 1:1:1",
	number_password_failed_attempts: number_password_failed_attempts
};



describe("userRepo", function()
{
	it("object", function(done)
	{

		factory.create({modelName: "user" }, function(error, repo)
		{
			should.notEqual(repo, null);
			done();
		});
	});


	it("when adding/reading/update/deleting a user", function(done)
	{
		testCreateUser(function(error, result) { done(); } );
	});
});


function testCreateUser(callback)
{	
	usersProv.getDefaultLookupValues( function(error, results)
	{

		newUser.culture_id = results.culture_id;
		newUser.time_zone_id = results.time_zone_id;
		newUser.type = results.type;
		
		factory.create({modelName: "user"}, function(error, repo)
		{
			repo.create(newUser, function(error, result) 
			{ 			
				should.equal(error, null);
				should.notEqual(result.insertId, null);

				testReadUser(repo, result.insertId, callback);
			});
		});
	});
}




function testReadUser(repo, id, callback)
{
	repo.findById(id, function(error, results) 
	{ 
		should.equal(error, null);

		var result = results[0];

		results.length.should.equal(1);

		result.id.should.not.equal(null);
		result.uuid.shouldbeUUID;
		result.email.should.equal(email);
		result.culture_id.should.not.equal(-1);
		result.time_zone_id.should.not.equal(-1);
		result.type.should.equal("power");
		result.password.should.equal(password);
		result.password_salt.should.equal(password_salt);
		result.is_unsubscribed.should.equal(false);
		result.is_active.should.equal(false);
		result.is_locked.should.equal(false);

		result.last_password_failed_time.should.equal("2014-01-01T01:01:01+00:00");
		result.number_password_failed_attempts.should.equal(number_password_failed_attempts);
		result.date_added.shouldbeDate;
		result.last_modified.shouldbeDate;

		testUpdateUser(repo, result, callback);

	});
}


function testUpdateUser(repo, user, callback)
{
	var updateUser = deepcopy(user);

	updateUser.email += "1";
	updateUser.password += "3";
	updateUser.password_salt += "4";
	updateUser.is_unsubscribed = true;
	updateUser.is_active = true;
	updateUser.is_locked = true;
	updateUser.last_password_failed_time =  "2015-1-1 2:1:1",
	updateUser.number_password_failed_attempts += 2;

	repo.update(updateUser, function(error, results) 
	{ 
		results.affectedRows.should.be.equal(1);
		results.changedRows.should.be.equal(1);

		testReadUpdatedUser(repo, updateUser.id, callback)
	});

}


function testReadUpdatedUser(repo, id, callback)
{
	repo.findById(id, function(error, results) 
	{ 
		should.equal(error, null);

		var result = results[0];
		
		results.length.should.equal(1);

		result.id.should.not.equal(null);
		result.uuid.shouldbeUUID;
		result.email.should.equal(email + "1");
		result.password.should.equal(password + "3");
		result.password_salt.should.equal(password_salt + "4");
		result.is_unsubscribed.should.equal(true);
		result.is_active.should.equal(true);
		result.is_locked.should.equal(true);
		result.number_password_failed_attempts.should.equal(number_password_failed_attempts + 2);

		result.last_password_failed_time.should.equal("2015-01-01T02:01:01+00:00");
		result.date_added.shouldbeDate;
		result.last_modified.shouldbeDate;
		
		testRemoveUser(repo, result, callback);

	});
}


function testRemoveUser(repo, result, callback)
{
	repo.remove(result, function(error, results) 
	{ 
		results.affectedRows.should.be.equal(1);
		results.changedRows.should.be.equal(0);

		callback(error, results);
	});
}



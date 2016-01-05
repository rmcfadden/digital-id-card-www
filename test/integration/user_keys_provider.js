var should = require("should");
var random = require("../../lib/random");

var testUtils = require("../../lib/test_utils.js");
var deepcopy = require("deepcopy");
var ip = require("ip");

var repositoryFactory = require("../../lib/repository_factory.js");
var factory = new repositoryFactory();

var userKeysProvider = require("../../lib/providers/user_keys_provider.js");
var userKeysProv = new userKeysProvider();


var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();



describe("userKeysProvider", function()
{
	it("when generate/create/reading/deleting a user key", function(done)
	{	
		testGenerateUserKey(function(error, result) { done(); } );
	});


	it("generateKeyPair/signRSA/verifyRSA", function(done)
	{	
		userKeysProv.generateKeyPair(2048, function(error, result)
		{

			result.private.shouldStartWith("-----BEGIN RSA PRIVATE KEY-----");
			result.private.shouldEndWith("-----END RSA PRIVATE KEY-----\n");

			result.public.shouldStartWith("-----BEGIN PUBLIC KEY-----");
			result.public.shouldEndWith("-----END PUBLIC KEY-----\n");


			var randomText = random.getRandomText(14);
	
			var encryptedText =  userKeysProv.encryptRSA(randomText, result.public);
			var decryptedText =  userKeysProv.decryptRSA(encryptedText, result.private);

			decryptedText.should.equal(randomText);

			done();
		});
	});
});


function testGenerateUserKey(callback)
{
	userKeysProv.generateKeyPair(1024, function(error, result)
	{

		result.private.shouldStartWith("-----BEGIN RSA PRIVATE KEY-----");
		result.private.shouldEndWith("-----END RSA PRIVATE KEY-----\n");

		result.public.shouldStartWith("-----BEGIN PUBLIC KEY-----");
		result.public.shouldEndWith("-----END PUBLIC KEY-----\n");

		testCreateUserKey(result, callback);

	});
}


function testCreateUserKey(key, callback)
{
	testUtil.createTestUser(function(error, user)
	{
		factory.create({ modelName: "user_key" }, function(error, repo)
		{
			var newUserKey = 
			{
				"user_id" :  user.user_id,
				"public_key" : key.public,
				"passphrase" : "bla bla",
				"is_expired" : false
			}

			userKeysProv.create(newUserKey, function(error, result) 
			{

				should.equal(error, null);
				should.notEqual(result.insertId, null);

				newUserKey.id = result.insertId;

				testReadUserKey(repo, newUserKey, callback);
			});
		});
	});
}


function testReadUserKey(repo, userKey, callback)
{
	repo.findById(userKey.id, function(error, results) 
	{ 
		should.equal(error, null);

		var result = results[0];
		results.length.should.equal(1);
		result.id.should.not.equal(null);
		result.uuid.shouldbeUUID;
		result.user_id.should.equal(userKey.user_id);
		result.name.should.equal("default");
		result.public_key.should.equal(userKey.public_key);
		result.key_length.should.equal(2048);
		result.passphrase.should.equal(userKey.passphrase);
		result.is_expired.should.equal(false);


		result.date_added.shouldbeDate;
		result.last_modified.shouldbeDate;

		testgetUserKey(repo, userKey, callback);

	});
}


function testgetUserKey(repo, userKey, callback)
{
	userKeysProv.getUserKey(userKey.user_id, userKey.name, function(error, results) 
	{ 
		should.equal(error, null);

		var result = results[0];
		results.length.should.equal(1);
		result.id.should.not.equal(null);
		result.uuid.shouldbeUUID;
		result.user_id.should.equal(userKey.user_id);
		result.name.should.equal("default");
		result.public_key.should.equal(userKey.public_key);
		result.key_length.should.equal(2048);
		result.passphrase.should.equal(userKey.passphrase);
		result.is_expired.should.equal(false);


		result.date_added.shouldbeDate;
		result.last_modified.shouldbeDate;

		testExpireUserKey(repo, userKey, callback);

	});
}


function testExpireUserKey(repo, userKey, callback)
{
	userKeysProv.expire(userKey.user_id, userKey.name, function(error, result) 
	{ 
		result.affectedRows.should.equal(1);
		result.changedRows.should.equal(1);

		testgetExpiredUserKey(repo, userKey, callback);
	});
}

function testgetExpiredUserKey(repo, userKey, callback)
{
	userKeysProv.getUserKey(userKey.user_id, userKey.name, function(error, results) 
	{ 
		should.equal(error, null);

		var result = results[0];
		results.length.should.equal(1);
		result.id.should.not.equal(null);
		result.uuid.shouldbeUUID;
		result.user_id.should.equal(userKey.user_id);
		result.name.should.equal("default");
		result.public_key.should.equal(userKey.public_key);
		result.key_length.should.equal(2048);
		result.passphrase.should.equal(userKey.passphrase);
		result.is_expired.should.equal(true);


		result.date_added.shouldbeDate;
		result.last_modified.shouldbeDate;

		testRemoveUserKey(repo, userKey, callback);

	});
}



function testRemoveUserKey(repo, userKey, callback)
{
	repo.remove(userKey, function(error, results) 
	{ 
		results.affectedRows.should.be.equal(1);
		results.changedRows.should.be.equal(0);

		testUtil.removeTestUser({ id: userKey.user_id }, function(errors, results)
		{

			callback(errors, results);
		});
	});
}



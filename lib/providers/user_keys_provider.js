var createKeys = require("rsa-json");
var config = require("../../config");

var crypto = require("crypto");

var repositoryFactory = require("../repository_factory");
var factory = new repositoryFactory();

var random = require("../random");
var moment = require("moment");


var ursa  = require("ursa");

var userKeysProvider = function()
{
	this.create = function(args, callback)
	{
		var proxyThis = this;
		factory.create({ modelName: "user_key" }, function(error, repo)
		{
			if(error)
			{
				callback(error, null)
				return;			
			}

			if(!args.keyLength)
				args.keyLength = 2048;


			proxyThis.generateKeyPair(args.keyLength, function(error, result)
			{
				if(!args.passphrase)
					args.passphrase = "";

				if(!args.name)
					args.name = "default";

				var newUserKey = 
				{
					"user_id" : args.user_id,
					"name" : args.name,
					"is_enabled" :  true,
					"public_key": args.public_key,
					"key_length" : args.keyLength,
					"passphrase" : args.passphrase
				};

				repo.create(newUserKey, function(error, result) 
				{
					callback(error, result);
				});
			});
		});
	}

	
	this.generateKeyPair = function(length, callback)
	{
		if(!length)
			length = 2048
		
		var keys = ursa.generatePrivateKey(1024)

		var privatePem = keys.toPrivatePem("utf8")
		var publicPem = keys.toPublicPem("utf8");




		callback(null, { "public" : publicPem, "private" : privatePem })
		/*
		createKeys({ "bits" : length }, function(error, result)
		{
			if(error)
			{
				console.log("error generating key pairs");
				return;		
			}

			callback(null, { "public" : result.public, "private" : result.private });
		});
		*/

	}


	this.getUserKey = function(user_id, name, callback)
	{
		var proxyThis = this;
		factory.create({ modelName: "user_key" }, function(error, repo)
		{
			if(error)
			{
				callback(error, null)
				return;			
			}

	
			repo.find({user_id : user_id, name: name}, function(error, result) 
			{
				callback(error, result);
			});
		});	
	}



	this.remove = function(user_id, name, callback)
	{
		factory.create({ modelName: "user_key" }, function(error, repo)
		{
			if(error)
			{
				callback(error, null)
				return;			
			}


			repo.remove({ user_id : user_id, name: name }, function(error, result) 
			{
                       		callback(error, null);
			});
		});	
	}


	this.expire = function(user_id, name, callback) 
	{
		factory.create({ modelName: "user_key" }, function(error, repo)
		{
			if(error)
			{
				callback(error, null)
				return;			
			}


			repo.updateBy({}, { set : { is_expired : true}, where: { user_id : user_id, name: name } }, function(error, result) 
			{
                       		callback(error, result);
			});
		});
	
	}


	this.createChallenge = function(user_id, name, callback)
	{
		this.getUserKey(user_id, name, function(error, results)
		{
			if(error)
			{
				callback(error);
				return;			
			}
			
			if(results.length == 0)
			{
				callback("cannot find a user_key for user_id " + user_id + ", keyname: " + name);
				return;			
			}

			var user_key = results[0];

			factory.create({ modelName: "user_key_challenge" }, function(error, repo)
			{
				if(error)
				{
					callback(error, null)
					return;			
				}

				var challengeExpireSeconds = 600;
				if(config.userKeys && config.userKeys.challengeExpireSeconds)
					challengeExpireSeconds = config.userKeys.challengeExpireSeconds;

				var challengeLength = 512;
				if(config.userKeys && config.userKeys.challengeLength)
					challengeLength = config.userKeys.challengeLength;

				var challenge = random.getRandomText(challengeLength);


				var user_key_challenge = 
				{
					"user_key_id" : user_key.id,
					"challenge" : challenge,
					"expity_time" : moment.utc(utcNow).add("second", challengeExpireSeconds).format()
				};
				
				repo.create(user_key_challenge, function(error, result) 
				{
					// TODO: encrypt using the pulic key

		               		callback(error, result);
				});
			});
		});
	}



	this.verifyChallenge = function(user_id,name, challenge, callback)
	{
	
	}


	this.encryptRSA = function (plaintext, publicKey)  
	{  
		var key = ursa.createPublicKey(publicKey, "utf8");
		return key.encrypt(plaintext, "utf8").toString("base64");
	}  
	  

	this.decryptRSA = function(plaintext, privateKey)  
	{  
		var key = ursa.createPrivateKey(privateKey, "", "utf8"); 
	 	return key.decrypt(plaintext, "base64").toString("utf8");
	}  
}

module.exports = userKeysProvider;

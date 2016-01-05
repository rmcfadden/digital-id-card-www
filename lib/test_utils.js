var should = require("should");
var random = require("./random");
var string = require("./string");

var repositoryFactory = require("./repository_factory");
var Type = require("type-of-is");
var moment = require("moment");
var fs = require("fs");
var restler = require("restler");

var usersProvider = require("../lib/providers/users_provider");
var usersProv = new usersProvider();

var server = require("../app");
var config = require("../config");


var validUUIDRegex = /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/;


Object.defineProperty(Object.prototype, "shouldbeUUID", 
{
	set: function(){},
	get: function(){  
 		return should.equal((this.match(validUUIDRegex) !== null), true); 
	}
});



Object.defineProperty(Object.prototype, "shouldbeDate", 
{
	set: function(){},
	get: function(){  

 		return should.notEqual(isNaN(Date.parse(this)), true); 
	}
});


if (typeof String.prototype.shouldStartWith != "function") 
{
	String.prototype.shouldStartWith = function (str)
	{
		should.equal(this.startsWith(str), true);
	}
};


if (typeof String.prototype.shouldEndWith != "function") 
{
	String.prototype.shouldEndWith = function (str)
	{
		should.equal(this.endsWith(str), true);
	}
};


var testUtils = function()
{
	this.factory = new repositoryFactory();
	this.currentServer = null;

	this.getTestUrl = function()
	{
		var returnUrl = "http://localhost:" + config.testListenPort + "/";
		if(config.servicesRoot && config.servicesRoot)
			returnUrl += config.servicesRoot + "/";

		return returnUrl;
	}

	this.getTestUser = function()
	{
		var email = random.getRandomHexText(32) + "test'@test.com";
		var alias = random.getRandomHexText(32);
		var password = random.getRandomHexText(32);
		var password_salt = random.getRandomHexText(16);
		var number_password_failed_attempts = 25;

		var newUser = 
		{ 
			email : email, 
			alias: alias, 
			password : password, 
			password_salt: password_salt,
			is_unsubscribed : false,
			is_active : false,
			is_locked : false,
			last_password_failed_time: "2014-1-1 1:1:1",
			number_password_failed_attempts: number_password_failed_attempts
		};

		return newUser;
	}


	this.createTestUser = function(callback)
	{
		var newUser = this.getTestUser();

		var email = random.getRandomHexText(36) + "test'@test.com";
		var password = random.getRandomHexText(36);

		usersProv.createByEmail(email, {password: password}, function(error, results)
		{		
			callback(error, results);
		});
	}



	this.removeTestUser = function(obj, callback)
	{
		usersProv.removeByUserId(obj.id, function(error, result)
		{				
			result.affectedRows.should.equal(1);			
			callback();
		});
	}


	this.setupTestEnvironment = function()
	{
		process.env.NODE_ENV = "test";
	}


	this.startTestServer = function(callback)
	{
		if(GLOBAL.isTestServerRunning)
		{
			callback();	
			return;
		}

		GLOBAL.isTestServerRunning = true;

		this.currentServer = new server();
		this.currentServer.start(callback);


	}


	this.stopTestServer = function(callback)
	{
		GLOBAL.isTestServerRunning = false;

		if(this.currentServer)
		{
			this.currentServer.stop(function () 
			{ 
				this.currentServer = null;		
					
				if(callback)
					callback();				
			});
		}
		
	}


	this.uploadFile = function(file, contentType, callback)
	{
		var proxyThis = this;
		fs.stat(file, function(error, stats) 
		{

			if(error)
			{
				callback(error);
				return;			
			}

			// TODO: insert my own code here
			restler.post(proxyThis.getTestUrl() + "upload", 
			{
				multipart: true,
				data: 
				{
					"filename": restler.file(file, null, stats.size, null, contentType)
				}
			}).on("success", function(data, response) 
			{
				response.data = data;
				callback(null, response);

			}).on("error", function(error, response)
			{
				error.response = response;
				callback(error, null);

			});
		});
	}

}
module.exports = testUtils;




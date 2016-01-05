var crypto = require("crypto");
var config = require("../../config");
var validator = require("validator");
var random = require("../random");


var sessionsProvider = require("./sessions_provider");

var authProvider = require("./authorization_provider");
var authProv = new authProvider();

var repositoryFactory = require("../repository_factory");
var factory = new repositoryFactory();

var createKeys = require("rsa-json");


var usersProvider = function()
{
	this.createByEmail = function(email, args, callback)
	{
		if(!this.internalVerifyEmailParam(email, callback))
			return;

		if(!this.internalVerifyPasswordParam(args.password, callback))
			return;

		var salt = this.createRandomSalt();
		var hashedPassword = this.createHashedPassword(args.password, salt);

		var newUser = 
		{ 
			email : email, 
			password : hashedPassword,
			password_salt: salt
		};



		var proxyThis = this;

		this.lookupByEmail(email, function(error, lookupResults)
		{

			if(error)
			{
				callback(error, null);
				return;			
			}


			if(lookupResults.length > 0)
			{
				callback("a user with email "  + email + " already exists", null);
				return;					
			}
			

			proxyThis.getDefaultLookupValues(function(error, result)
			{
				if(error)
				{
					callback(error, null);
					return;			
				}

				newUser.culture_id = result.culture_id;		
				newUser.time_zone_id = result.time_zone_id;
				newUser.type = result.type;

				if(args.is_anonymous)
					newUser.type = "anonymous";

				factory.create({modelName: "user", shard  : "new" }, function(error, repo)
				{
					repo.create(newUser, function(error, result) 
					{ 
						if(error)
						{
							callback(error, null);
							return;			
						}


						if(args.roles && args.roles.length > 0)	
						{
							authProv.addRoles(result.insertId, args.roles, function(error, roleResults)
							{		
								if(error)
								{
									callback("user create with id" + result.insertId + ", but error creatign roles");
									return;							
								}
			
								callback(null, { user_id: result.insertId, roles: roleResults });
							});
						}
						else
						{
							callback(null, {user_id: result.insertId});
						}

					});
				});


			});
		});


	}


	this.createByAnonymous = function(callback)
	{
		var email = random.getRandomHexText(10) + "test@random-user.com";
		var password = random.getRandomHexText(10);
		
		this.createByEmail(email, {"password" : password, "is_anonymous" : true}, function(error, result)
		{
			if(error)
			{
				callback(error, result);
				return;			
			}			

			result.anon_id = password + "-" + email;

			callback(null, result);
		});
	}


	this.createByFacebook = function(facebookAccessToken, callback)
	{
		if(!facebookAccessToken)
		{
			callback("facebookAccessToken parameter must be provided");
			return;
		}
	}


	this.verifyByEmailPassword = function(email, password, callback)
	{

		if(!email)
		{
			callback("email parameter must be provided");
			return;
		}

		if(!password)
		{
			callback("password parameter must be provided");
			return;
		}


		var proxyThis = this;
		this.lookupByEmail(email, function(email, result)
		{
			proxyThis.internalVerifyPassword(result[0], password, callback);		
		});
	}


	this.lookupByEmail = function(email, callback)
	{
		factory.create({modelName: "user" }, function(error, repo)
		{	
			repo.findByEmail(email, function(error, results) 
			{ 

				if(error)
				{
					callback(error, null);
					return;			
				}


				callback(null, results);
			});
		});

	}


	this.verifyByIdPasswordValid = function(id, password, callback)
	{
		if(!id)
		{
			callback("id parameter must be provided");
			return;
		}

		if(!password)
		{
			callback("password parameter must be provided");
			return;
		}


		var proxyThis = this;
		factory.create({ modelName: "user", shard: { user_id : id }  }, function(error, repo)
		{
			repo.findById(id, function(error, result) 
			{ 
				if(error)
				{
					callback(error, null);
					return;			
				}

				if(result.length ==0 )
				{
					callback("cannot find user");
					return;				
				}

				proxyThis.internalVerifyPassword(result[0], password, callback);

			});
		});
	}


	this.removeByUserId = function(user_id, callback)
	{

		factory.create({modelName: "user", shard : { user_id : user_id } }, function(error, repo) 
		{
			repo.remove({ id : user_id }, function(error, results) 
			{ 

				results.affectedRows.should.be.equal(1);
				results.changedRows.should.be.equal(0);

				callback(error, results);
			});
		});
	}


	this.getDefaultLookupValues = function(callback)
	{
		this.getLookupValues({ "culture": "English", "time_zone" : "GMT Standard Time" }, function(error, result)
		{
			if(result)
				result.type = "power";
			
			callback(error, result);
		} );
		
	}


	this.getLookupValues = function(args, callback)
	{
		factory.create({ modelName: "culture" }, function(error, repo)
		{
			repo.findByName(args.culture, function(error, results) 
			{ 
				var cultureId = results[0].id;

				factory.create({modelName: "time_zone" }, function(error, repo)
				{
					repo.findByName(args.time_zone, function(error, results) 
					{ 					
						var time_zone_id = results[0].id;

						var returnVal =  { "culture_id" : cultureId, "time_zone_id" : time_zone_id };

						callback(null, returnVal);
					});
				});
			});
		});

	}


	this.internalVerifyPassword = function(user, password, callback)
	{
		var user_id = user.id;
		
		if(user.is_locked)
		{
			callback("account is locked");
			return;
		}
	

		this.verifyPasswordIsValid(user, password, function(error, result)
		{
			callback(error, { "user_id" : user_id, "is_password_valid" : result });
		});

	}


	this.verifyPasswordIsValid = function(user, password, callback)
	{
		if(!user)
		{
			callback("user cannot be null");
			return;		
		}

		var hashedPassword = this.createHashedPassword(password, user.password_salt);

		var ArePasswordsEqual = (user.password == hashedPassword);		
		callback(null, ArePasswordsEqual);
	}


	this.updateEmail = function(user_id, email, callback)
	{
		this.lookupByEmail(email, function(error, result)
		{
			
		});
	}


	this.createHashedPassword = function(password, salt)
	{
		if(!password)
			throw new Error("password parameter must be provided");

		if(!salt)
			throw new Error("salt parameter must be provided");

		return crypto.createHash("sha256").update(password + salt).digest("hex");
	}



	this.createRandomSalt = function(len)
	{
		if(!len)
			len = 32;

		return crypto.randomBytes(len).toString("base64");
	}



	this.internalVerifyEmailParam = function(email, callback)
	{
		if(!email)
		{
			callback("email parameter must be provided");
			return false;
		}

		if(!validator.isEmail(email))
		{
			callback("email parameter is not a valid email");
			return false;
		}

		return true;
	}


	this.internalVerifyPasswordParam = function(password, callback)
	{
		if(!password)
		{
			callback("password parameter must be provided");
			return false;
		}

		if(config.minPasswordLength)
		{

			var passwordText = String(password);	
			if(passwordText.length < config.minPasswordLength)
			{
				callback("password must be " + config.minPasswordLength + " in length");
				return false;
			}
		}

		return true;
	
	}
}


module.exports = usersProvider;

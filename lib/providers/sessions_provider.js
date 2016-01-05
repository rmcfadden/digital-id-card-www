var crypto = require("crypto");
var ip = require("ip");
var moment = require("moment");
var config = require("../../config");
var dateTime = require("../date_time");

var cookie = require("cookie");

var repositoryFactory = require("../repository_factory");
var factory = new repositoryFactory();

var sessionsProvider = function()
{
	this.newSession = function(user_id, client_ip, callback)
	{
		if(!client_ip)
		{
			client_ip = "0.0.0.0";
		}

		var durationSeconds = 2592000;
		if(config.session && config.session.durationSeconds)
			durationSeconds = config.session.durationSeconds;

		var utcNow = dateTime.utcNow();

		var newSession = 
		{ 
			user_id : user_id,
			ip_address : ip.toLong(client_ip),
			start_time :  moment.utc(utcNow).format(),
			end_time : moment.utc(utcNow).add('second', durationSeconds).format()
		};

		
		var proxyThis = this;
		factory.create({ modelName: "session" }, function(error, repo)
		{
			repo.create(newSession, function(error, result) 
			{
				if(error)
				{
					callback(error, result);
					return;	
				}			
			
				proxyThis.updateSession(result.insertId, function(error, result)
				{
					callback(error, result);
				});
			});
		});
	}


	this.endSession = function(session, callback)
	{
		factory.create({ modelName: "session" }, function(error, repo)
		{		
			// TODO: verify
			repo.updateSetIs_expired(session, true, function(error, result) 
			{
				if(error)
				{
					callback(error, null);
					return;					
				}

				if((result.affectedRows === 0)  && (result.changedRows === 0))
				{
					callback("no sessions where found", null);
					return;					
				}
				
				callback(error, result);
			});
		});
	}


	this.updateSession = function(id, callback)
	{
		var proxyThis = this;
		this.getSession(id, function(error, result)
		{
			if(error)
			{
				callback(error, null);
				return;			
			}


			if(!result)
			{
				callback("could not find session in updateSession");
				return;			
			}

			var newSession = result;
			
			
			factory.create({ modelName: "session" }, function(error, repo)
			{
				newSession.hit_count++;
				newSession.last_activity_time =  moment.utc().format();

				repo.updateBy(newSession, { set : { hit_count : newSession.hit_count, last_activity_time : newSession.last_activity_time }}, function(error, result) 
				{
					if(error)
					{
						callback(error, null);
						return;					
					}

					if((result.affectedRows === 0)  && (result.changedRows === 0))
					{
						callback("no sessions where updated", null);
						return;					
					}

					newSession.accessToken = proxyThis.createAccessToken(newSession);
					
					callback(error, newSession);
				});
			});
		});
	}


	this.getSession = function(id,callback)
	{
		var proxyThis = this;
		factory.create({modelName: "session"}, function(error, repo)
		{
			if(error)
			{
				callback(error, null);
				return;			
			}

			
			repo.findById(id, function(error, results) 
			{
				var result = null;
				if(results.length > 0)
				{
					result = results[0];
					result.accessToken = proxyThis.createAccessToken(result);

				}
				
				callback(error, result);
			});
		});
	}


	this.getSessionByUuid = function(uuid,callback)
	{
		var proxyThis = this;
		factory.create({ modelName: "session" }, function(error, repo)
		{
			if(error)
			{
				callback(error, null);
				return;			
			}

			
			repo.findByUuid(uuid, function(error, results) 
			{
				var result = null;
				if(results.length > 0)
				{
					result = results[0];
					result.accessToken = proxyThis.createAccessToken(result);

				}
				
				callback(error, result);
			});
		});
	}


	this.verifyIsSessionExpired = function(session)
	{
		if(!session)
			throw new Error("session cannot be empty");	
		
		if(session.is_expired === true)
		{
			return true;
		}

		var utcNow = dateTime.utcNow();
		var currentUtc = moment(utcNow).utc();
		var dateDiff = moment(session.end_time).utc().diff(currentUtc, "seconds");


		return (dateDiff <= 0);
	}


	this.createAccessToken = function(session)
	{
		if(!session)
			throw new Error("session cannot be empty");

		if(!session.uuid)
			throw new Error("session.uuid cannot be empty");

		if(!session.user_id)
			throw new Error("session.user_id cannot be empty");

		var cipherAlgo = "aes-128-cbc";
		if(config.session && config.session.cipherAlgo)
			cipherAlgo = config.session.cipherAlgo;

		var accessTocken = session.uuid + "_" + session.user_id;	

		var key = "@abc123!";
		if(config.session && config.session.key)
			key = config.session.key;

		var iv = "@abc123!1234ABCD";
		if(config.session && config.session.iv)
			iv = config.session.iv;

		var cipher = crypto.createCipher(cipherAlgo, key, iv);
		var encrypted = cipher.update(accessTocken, "utf8", "hex");
		encrypted  += cipher.final("hex");


		return encrypted;		
	}


	this.extractAccessTockenInfo = function(token)
	{
		if(!token)
			throw new Error("token cannot be empty");

		var cipherAlgo = "aes-128-cbc";
		if(config.session && config.session.cipherAlgo)
			cipherAlgo = config.session.cipherAlgo;

		var key = "@abc123!";
		if(config.session && config.session.key)
			key = config.session.key;

		var iv = "@abc123!1234ABCD";
		if(config.session && config.session.iv)
			iv = config.session.iv;

		var decipher = crypto.createDecipher(cipherAlgo, key, iv);
		var decrypted = "";
                try
		{
			decrypted = decipher.update(token, "hex", "utf8");
			decrypted += decipher.final("utf8");
		}
		catch(ex) {}

		if(!decrypted)
			return null;		

		var items = decrypted.split("_");
		if(items.length != 2)
			return null;	

		if(!parseInt(items[1]))
			return null;
		
		return { uuid: items[0], user_id: parseInt(items[1]) };
	}


	this.getSessionFromRequest = function(request, callback)
	{	
		if(!request)
			throw new Error("request cannot be null");
	

		var accessToken = null;

		// extract the access_token from the querystring
		if(request.query && request.query.access_token)
		{
			accessToken = request.query.access_token;
		}
		else if(request.cookies.access_token)
		{
			accessToken = request.cookies.access_token;
		}
	
		if(!accessToken)
		{
			callback("access token not provided", null);
			return;
		}


		var proxyThis = this;
		this.getSessionFromToken(accessToken, function(error, result)
		{
			if(error)
			{
				callback(error, null);
				return;			
			}

			if(!result)
			{
				callback("no session found", null);
				return;			
			
			}


			if(proxyThis.verifyIsSessionExpired(result))
			{
				callback("session expired", null);
				return;
			}

			callback(null, result);
		});
	}



	this.getSessionFromToken = function(token, callback)
	{

		var tokenInfo = this.extractAccessTockenInfo(token);


		if(!tokenInfo)
		{
			callback("error extracting token information.  invalid token", null);
			return;
		}


		if(!tokenInfo.uuid)
		{
			callback("error extracting token information.  cannot find uuid", null);
			return;
		
		}


		if(!tokenInfo.user_id)
		{
			callback("error extracting token information.  cannot find user_id");
			return;		
		}


		this.getSessionByUuid(tokenInfo.uuid, function(error, result)
		{
			if(error)
			{
				callback(error, null);
				return;			
			}

			callback(null, result);
			
		});

	}


	this.endAllSessions = function(user_id,callback)
	{
		var proxyThis = this;
		factory.create({ modelName: "session" }, function(error, repo)
		{
			callback();
		});
	}


	this.setAccessTokenCookie = function(response, accessToken)
	{
		var durationSeconds = 2592000;
		if(config.session && config.session.durationSeconds)
			durationSeconds = config.session.durationSeconds;

		var durationMilliseconds = durationSeconds * 1000;


		response.cookie("access_token", accessToken, { maxAge: durationMilliseconds } );
	}


}


module.exports = sessionsProvider;

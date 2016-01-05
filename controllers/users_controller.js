"use strict";

var config = require("../config");

var standardResponse = require("../lib/standard_response");
var responseHelper = new standardResponse();

var usersProvider = require("../lib/providers/users_provider");
var usersProv = new usersProvider();

var sessionsProvider = require("../lib/providers/sessions_provider");
var sessionsProv = new sessionsProvider();

var responseHelper = new standardResponse();

var me = function(request,response)
{
	responseHelper.errorHandler(request, response, function(request,response)
	{
		sessionsProv.getSessionFromRequest(request, function(error, session)
		{
			if(error)
			{
				responseHelper.sendError(response, error);
				return;
			}
			

			response.send({ "user_id" : session.user_id, "access_token": session.accessToken });
		});
	});
}




var login = function(request,response)
{
	responseHelper.errorHandler(request, response, function(request,response)
	{

		var body = request.body;
		
		// create by email
		if(body && body.email)
		{
			internalLoginByEmailPassword(body.email, body.password, request, response);
			return;
		}
		
		responseHelper.sendError(response, "please provide valid login parameters");
		
	
	});
}


var logout = function(request,response)
{
	responseHelper.errorHandler(request, response, function(request,response)
	{
		sessionsProv.getSessionFromRequest(request, function(error, session)
		{
			if(error)
			{
				responseHelper.sendError(response, error);
				return;
			}

			if(!session)
			{
				responseHelper.sendError(response, "no sessions found");
				return;
			}	


			sessionsProv.endSession(session, function(error, result)
			{
				if(error)
				{
					responseHelper.sendError(response, error);
					return;
				}

				if(!result)
				{
					responseHelper.sendError(response, "no sessions updated");
					return;
				}	

				var affectedRows = 0;
				if(result.affectedRows)
					affectedRows = result.affectedRows;

				response.clearCookie("access_token");

				response.send({ "message" : affectedRows + " sessions expired" });

			});
		});
	});
}

var create = function(request,response)
{
	responseHelper.errorHandler(request, response, function(request,response)
	{			
		var body = request.body;
		
		// create by email
		if(body && body.email)
		{
			internalCreateByEmailPassword(body.email, body.password, request, response);
			return;
		}

		// create by facebook
		if(1 === 1)
		{
			// TODO		
		}


		internalCreateAnonymous(request, response);

	});
}


var update = function(request,response)
{
	responseHelper.errorHandler(request, response, function(request,response)
	{	
		response.send({ "message" : "update" });

	});
}




var remove = function(request,response)
{
	responseHelper.errorHandler(request, response, function(request,response)
	{	
		response.send({ "message" : "remove" });

	});
}



function internalLoginByEmailPassword(email, password, request, response)
{
	usersProv.verifyByEmailPassword(email, { password: password }, function(error, result)
	{
		if(error)
		{
			responseHelper.sendError(response, error);
			return;
		}

		sessionsProv.newSession(result.user_id, request.connection.remoteAddress, function(error, sessionResult)
		{
			if(error)
			{
				responseHelper.sendError(response, error);
				return;
			}

			result.access_token = sessionResult.accessToken;
			sessionsProv.setAccessTokenCookie(response, result.access_token);
			response.send(result);
		});			 
	});
}



var internalCreateAnonymous = function(request, response)
{
	usersProv.createByAnonymous(function(error, result)
	{	
		if(error)
		{
			responseHelper.sendError(response, error);
			return;
		}

		sessionsProv.newSession(result.user_id, request.connection.remoteAddress, function(error, sessionResult)
		{
			if(error)
			{
				responseHelper.sendError(response, error);
				return;
			}

			result.access_token = sessionResult.accessToken;
			sessionsProv.setAccessTokenCookie(response, result.access_token);
			response.send(result);
		});					 
	});
}


var internalCreateByEmailPassword = function(email, password,  request, response)
{
	usersProv.createByEmail(email, { password: password }, function(error, result)
	{
		if(error)
		{
			responseHelper.sendError(response, error);
			return;
		}

		sessionsProv.newSession(result.user_id, request.connection.remoteAddress, function(error, sessionResult)
		{
			if(error)
			{
				responseHelper.sendError(response, error);
				return;
			}

			result.access_token = sessionResult.accessToken;
			sessionsProv.setAccessTokenCookie(response, result.access_token);
			response.send(result);
		});			 
	});
}



exports.me = me;
exports.login = login;
exports.logout = logout;
exports.update = update;
exports.create = create;
exports.remove = remove;

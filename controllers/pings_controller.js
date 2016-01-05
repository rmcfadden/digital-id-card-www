"use strict";

var connection = function(socket)
{
	socket.on("ping", function(data)
	{
		if(!data.url)
		{
			writeFinalResponse(socket, false, "please provide a valid url",null);
			return;					
		}

		var validator = require ("validator");


		var url = require("url");
		var parsedHost = url.parse(data.url);
		var host = null;
		if(parsedHost.host)
			host = parsedHost.host;
		else
			host = data.url;

		var isIP = validator.isIP(host);

		if(!isIP)
		{
			var dns = require("dns");
			dns.lookup(host, function(error, ipAddress)
			{
				if(error)
				{
					writeFinalResponse(socket, false, error);					
					return;

				}

				handlePingResponse(ipAddress, socket);
			});
		}
		else
		{
			handlePingResponse(host, socket);
		}
	});

}

var handlePingResponse = function(ipAddress, socket)
{
	ping(ipAddress, function(error, response, duration)
	{	
		if(error)
		{
			writeFinalResponse(socket, false, error, duration);
	    	return;
		}


		writeFinalResponse(socket, true, response, duration);
	});
}


var ping = function(ipAddress, callback)
{
	var netPing = require ("net-ping");
	var session = netPing.createSession();

	session.pingHost(ipAddress, function (error, target, sent, rcvd) 
	{
		var duration = Math.abs(rcvd - sent);

	    if (error)
	    {
	    	callback(error, null, duration);
	    	return;
	    }

    	callback(null, target, duration);
    	session.close();
	});

}

var writeFinalResponse = function(socket, is_success, response, duration)
{
	socket.emit("response",  { "is_success": is_success, "response": response, "duration": duration } );
	socket.disconnect();

}

exports.connection = connection;
"use strict";

var networkTools =  {};
(function() 
{

	this.socket = null;
	this.options = null;
	this.responseCallbacks = [];

	this.load = function(options, callback)
	{

		var defaults = 
		{  
		}; 

		this.options = $.extend(defaults, options);  

		// load socket.io
		// TODO: use AMD loading or Require.js?
		$.getScript("/js/socket.io-1.2.0.js", function()
		{
			if(callback)
				callback();
		});
	}


	this.execute = function(url, options)
	{
		this.socket = io.connect("/ping", { 'force new connection': true });

		var proxyThis = this;
		this.socket.on('connect', function(data) 
		{
			proxyThis.socket.emit("ping", { "url" : url, "options" : options });
		});

		var proxyThis = this;
		this.socket.on("response", function(response)
		{
			proxyThis.raiseResponse(response);
		});

		this.socket.on("disconnect", function(response)
		{
console.log("DISCONNECT!!");
			this.socket = null;
		});


	}


	this.onResponse = function(callback)
	{
		this.responseCallbacks.push(callback);
	}


	this.raiseResponse = function(response)
	{
		for(var i=0; i < this.responseCallbacks.length; i++)
		{
			var responseCallback = this.responseCallbacks[i];
			responseCallback(response);
		}
	}


}).apply(networkTools);

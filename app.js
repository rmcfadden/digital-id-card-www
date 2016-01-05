'use strict';

var cluster = require("cluster");
var http = require("http");
var os = require("os");
var config = require("./config");

http.globalAgent.maxSockets = 25;

var currentServer = null;
var io = null;

function server()
{
	this.currentServer = null;
	this.currentRouter = null;
	this.isExiting = false;

	this.start = function(callback)
	{
		var processInfos = {};
		if(cluster.isMaster && process.env.NODE_ENV != "test" && config.cluster && config.cluster.multiProcess)
		{
			if(config.cluster.processModel == "ports")
			{	
				var ports = config.cluster.ports;
				for (var i = 0; i < ports.length; i++)
				{				
					var port = ports[i];
					var env = {};
					env["listenPort"] = port;

					var worker = cluster.fork(env);

					processInfos[worker.id] = env;
				}
			}
			else
			{
				var numberOfCPUs = os.cpus().length;
				var numberOfProcesses = (numberOfCPUs * config.clusterCPUMultiplier);
				
				for (var i = 0; i < numberOfProcesses; i++)
				{				
					cluster.fork();
				}

			}

			var proxyThis = this;
			cluster.on('exit', function (worker, code, signal)
			{

			  	console.log("Worker " + worker.id + " with pid: " + worker.process.pid + " exited.  Code: " + (code | signal));

			  	if(!proxyThis.isExiting) 
			  	{
					var info = processInfos[worker.id];

					if(info)
					{
				  		var env = {};
						env["listenPort"] = processInfos[worker.id].listenPort;
		
					  	var worker = cluster.fork(env);
						processInfos[worker.id] = env;
					}
			  	}

			});

		}
		else
		{
			// setup the environment			
			var listenPort = config.listenPort;
			if(process.env["listenPort"])
				listenPort = process.env["listenPort"];

			if(process.env.NODE_ENV == "test")
				listenPort = config.testListenPort;
			 
			process.env["listenPort"] = listenPort;

			var pid = "unknown";
			if(process.pid)
				pid = process.pid;	

			var environment = "unknown";
			if(process.env.NODE_ENV)
				environment = process.env.NODE_ENV;

	
			var router = require("./lib/router");
			var express = require("express");
			var app = new express();
			var http = require("http");
			var compression = require("compression");
			var cookieParser = require("cookie-parser");
	

			var server = http.createServer(app);


			io = require('socket.io')(server);
			var redis = require('socket.io-redis');
			io.adapter(redis({
			    host: 'localhost',
			    port: 6379
			}))	


			app.disable('x-powered-by');
			app.use(compression());
			app.use(cookieParser());
			app.set("view engine", "ejs");
		

			// add api, page, and io routes
			this.currentRouter = new router();
			this.currentRouter.apply(app);
			this.currentRouter.applyIo(io);


			console.log("Starting on port " + listenPort + ", on process pid: " + pid + ", Environment: " + environment);
			
			this.currentServer = server;
			server.listen(listenPort, function()
			{							
				console.log("Listening on port " + listenPort + ", on process pid: " + pid + ", Environment: " + environment);

				if(callback)
					callback();
			});
		}
	}


	this.stop = function(callback)
	{

		if(this.currentServer)
		{
			// how to close connections: http://stackoverflow.com/questions/14626636/how-do-i-shutdown-a-node-js-https-server-immediately/14636625#14636625
			var ProxyThis = this;
			this.currentServer.close(function(){
				if(callback)
					callback();			

				ProxyThis.currentServer = null;
			 });
			
		}

	}
}


process.on("SIGINT", function() {
	currentServer.isExiting = true;

	currentServer.stop(function() {
	 	process.exit();
	});
})


// runs if "nodejs app.js" is called
if(!module.parent)
{
	currentServer = new server();
	currentServer.start();
}


module.exports = server;

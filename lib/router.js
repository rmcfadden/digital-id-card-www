"use strict"

var standardController = require("./standard_controller");
var inflection = require("./inflection");
var config = require("../config");
var version = require("../version");

var standardResponse = require("./standard_response");



var router = function()
{
	this.shouldDebug = true;

	this.apply = function(app)
	{

		// 1. api routes
		var rootUrl = "/";
		if(config.servicesRoot)
		{
			rootUrl += config.servicesRoot + "/";
		}

		var apiRoutes = require("../routes/api_routes").routes;


		var routeInfos = this.getRouteInfos(apiRoutes);

		for(var i=0; i< routeInfos.length; i++)
		{
			var routeInfo = routeInfos[i];
			var routeUrl = rootUrl + routeInfo.name;
			
			if(routeInfo.function == null)
				throw Error("No function defined for route name: " + routeInfo.name);

				
			app[routeInfo.method](routeUrl, routeInfo.function);
			
			this.writeDebugText("adding api route: [" + routeInfo.method + "] "  + routeUrl);	
					
		}


		// 2. View routes
		var title = "no title";
		if(config.title)
			title = config.title;

		var pageRoutes = require("../routes/routes");


		if(pageRoutes && pageRoutes.routes)
		{
			for (var i=0; i < pageRoutes.routes.length; i++)
			{
				var proxyThis = this;
				(function() {	

					var routeInfo = pageRoutes.routes[i];
					if(routeInfo.name && routeInfo.view)
					{
						var locals =  null;
						if(routeInfo.locals)
						{
							locals = routeInfo.locals;		
						}
						else
						{
							locals = { locals: { title: title } };
						}

						locals.version =  version.version;

						app.get(routeInfo.name, function(request, response) { response.render(routeInfo.view, locals); });
						proxyThis.writeDebugText("adding view route: [" + routeInfo.name + "] ");	

					}
				})();
			}
		}

	
	}


	this.applyIo = function(io)
	{
		if(io == null)
			throw Error("io cannot be null");
		
		var ioRoutes = require("../routes/io_routes");
		if(ioRoutes && ioRoutes.routes)
		{
			for (var i=0; i < ioRoutes.routes.length; i++)
			{
				var proxyThis = this;
				(function() 
				{	
					var routeInfo = ioRoutes.routes[i];

					if(routeInfo.name)
					{
						var controllerName = routeInfo.name;
						if(routeInfo.controller)
							controllerName = routeInfo.controller;

						var controller = require("../controllers/" + controllerName + "_controller.js");
						if(controller)
						{
							io.of("/" + routeInfo.name).on("connection", function (socket)
							{
								controller.connection(socket);
							});

							//app.get(routeInfo.name, function(request, response) { response.render(routeInfo.view, locals); });
							proxyThis.writeDebugText("adding io route: [" + routeInfo.name + "] ");	
						}
					}

				})();
			}
		}
	}


	this.getRouteInfos = function(routes)
	{
		if(routes == null)
			throw Error("routes cannot be null");

		var routeInfos = [];
		for(var i=0; i< routes.length; i++)
		{
			var route = routes[i];
			if(!route.name)
				throw Error("route must have a name property");


			var routeName = inflection.pluralize(route.name);
			if(route.hasOwnProperty("pluralizeName") && !route.pluralizeName)
			{
				routeName = route.name;
			}

			if(!route.methods)
				continue;

			for(var j=0; j < route.methods.length; j++)
			{
				var currentMethod = route.methods[j];

				if(!currentMethod.name && !currentMethod.method)
					throw Error("method or name must exist in method items");

				var name = currentMethod.name;
				var method = "get";
				if(currentMethod.method)
					method = currentMethod.method.toLowerCase();		
											

				var controllerName = route + "_controller";
				if(route.controller)
					controllerName = route.controller;

				var controller = null;
				if(currentMethod.controller == "standard")
					controller = require("../lib/standard_controller.js");
				else
					controller = require("../controllers/" + routeName + "_controller.js");

						
				if((method == "get" && !name) || (method == "get" && name == "/"))
				{
					routeInfos.push({ "method": method, "name" : routeName, "function": controller.findAll });
				}
				else if((method == "post" && !name) || (method == "post" && name == "/"))
				{
					routeInfos.push({ "method": method, "name" : routeName, "function": controller.create });			
				}
				else if((method == "put" && !name) || (method == "put" && name == "/"))
				{
					routeInfos.push({ "method": method, "name" : routeName, "function": controller.update });			
				}
				else if((method == "delete" && !name) && (method == "delete" && name == "/"))
				{
					routeInfos.push({ "method": method, "name" : routeName + "/", "function": controller.remove });			
				}
				else if((method == "get") && ((name == ":id") || (name == "/:id")))
				{
					routeInfos.push({ "method": method, "name" : routeName + "/:id", "function": controller.findById });			
				}
				else
				{
					routeInfos.push({ "method": method, "name" : routeName + "/" + name, "function": controller[name] });			
				}
			}
							
		}

		return routeInfos;
	}


/*
	this.applyRouteInfo = function(app)
	{
		var rootUrl = "/";
		if(config.servicesRoot)
		{
			rootUrl += config.servicesRoot + "/";
		}

		var routes = require("../routes").routes;

		var routeInfos = this.getRouteInfos(routes);
		
	}
*/

	this.writeDebugText = function(text)
	{
		if(this.shouldDebug)
		{
			console.log(text);
		}
	}


}

module.exports = router;

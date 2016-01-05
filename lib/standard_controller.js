var config = require("../config");
var inflection = require("./inflection");
var connectionManager = require("./connection_manager");
var repositoryFactory = require("./repository_factory");
var standardResponse = require("./standard_response");

var factory = new repositoryFactory();
var responseHelper = new standardResponse();

var modelInspector = require("./model_inspector");




var findAll = function(request,response)
{		
	responseHelper.errorHandler(request, response, function(request,response)
	{
		var model = getModel(request);
	
		factory.create({"model" : model, "connectionName" : "user"}, function(error, repo)
		{		

			var query = request.query;

			var inspector = new modelInspector();
			inspector.model = model;
			var fields = inspector.getEffectiveFields();
			
			var queryFields = [];			
			for(i=0; i < fields.length; i++)
			{
				var field = fields[i];
				if(query[field.name])
				{
					queryFields.push({"name": field.name, "value": query[field.name]});
				}		
			}

			if(queryFields.length > 0)
			{	
				var currentField = queryFields[0];
				var methodName = "findBy" + currentField.name.capitalize();
				
				repo[methodName](currentField.value, function(error, results)
				{
					responseHelper.sqlDataResponse(response, error, results);
				});
			}
			else
			{
				repo.findAll(function(error, results)
				{
					responseHelper.sqlDataResponse(response, error, results);
				});
			
			}
		});	

	});
}



var findById = function(request,response)
{
	responseHelper.errorHandler(request, response, function(request,response)
	{
		var model = getModel(request);


		factory.create({"model" : model, "connectionName" : "user"}, function(error, repo)
		{		
			repo.findById(request.params.id,function(error, results)
			{
				responseHelper.sqlDataResponse(response, error, results);
			});
		});	

	});
}


var me = function(request,response)
{
	responseHelper.errorHandler(request, response, function(request,response)
	{

	});
}


var create = function(request,response)
{
	responseHelper.errorHandler(request, response, function(request,response)
	{
	});
}


var update = function(request,response)
{
	responseHelper.errorHandler(request, response, function(request,response)
	{
	});
}


var remove = function(request,response)
{
	responseHelper.error_errorHandler(request, response, function(request,response)
	{
	});
}



var getModel = function(request)
{
	var modelInfo = extractModelInfo(request)

	if(modelInfo == null)
		throw new Error("Cannot get model name from request");

	return require("../model/" + modelInfo.name);
}


var extractModelInfo = function(request)
{
	var rootUrl = "/";
	if(config.servicesRoot)
	{
		rootUrl += config.servicesRoot + "/";
	}


	var reducedString = request.path.replace(rootUrl, "");


	var modelNameIndex = reducedString.indexOf("/");
	var modelName = reducedString;
	if(modelNameIndex != -1)
	{
		modelName = reducedString.substring(0, modelNameIndex);	
	}


	modelName = inflection.singularize(modelName);


	return { "name" : modelName };
}


exports.me = me;
exports.findAll = findAll;
exports.findById = findById;
exports.create = create;
exports.update = update;
exports.remove = remove;

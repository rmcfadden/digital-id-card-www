var standardResponse = function()
{
	this.errorHandler = function(request, response, callback)
	{
		try
		{	
			callback(request, response)
		}
		catch(ex)
		{
			this.sendError(response, ex.message);
		}
	}


	this.sqlDataResponse = function(response, error, results)
	{
		if(error)
			this.sendError("error runnning query: " + error.code);
		else
			response.send({"items": results });
	}


	this.sendError = function(response, message)
	{
		response.send({"is_success": false, "message" : message});
	}
	
}

module.exports = standardResponse;

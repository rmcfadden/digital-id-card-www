var jsonFile = require("jsonfile")
var currentVersion = require("../version");

var version = function()
{
	this.update = function(callback)
	{
		var versionFile =  "version.json";

		var updateVersion = this.current();

		var proxyThis = this;
		jsonFile.readFile(versionFile, function(error, results) 
		{
			if(error)
			{
				callback(error, null);
				return;			
			}				

			results.version = proxyThis.getUpdatedVersion(results.version);

			jsonFile.writeFile(versionFile, results, function(error, result)
			{
				if(!error)
				{				
					delete  require.cache[require.resolve("../version")];
					currentVersion = require("../version");
				}

				callback(error, { version: results.version });
			})


		});	
	}

	this.current = function()
	{
		return currentVersion.version;
	}


	this.getUpdatedVersion = function(currentVersion)
	{
		if(currentVersion == null)
			throw new Error("current version cannot be null");

		if(currentVersion == "")
			throw new Error("current version cannot be empty");
		
		var splitVersions = currentVersion.split(".");
		var lastVal = this.getLastVersion(currentVersion);
		
		lastVal++;
		splitVersions[splitVersions.length - 1] = lastVal;

		return splitVersions.join(".");
	}


	this.getLastVersion = function(currentVersion)
	{
		var splitVersions = currentVersion.split(".");
		if(splitVersions.length < 1)
			throw new Error("current must be stored in x.x notation");
		
		if(!parseInt(splitVersions[splitVersions.length - 1]))
			throw new Error("current must be stored in x.x notation");

		return parseInt(splitVersions[splitVersions.length - 1]);
	}

}

module.exports = version;

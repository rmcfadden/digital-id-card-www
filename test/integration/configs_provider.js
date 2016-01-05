var should = require("should");

var random = require("../../lib/random");


var configsProvider = require("../../lib/providers/configs_provider");
var configsProv = new configsProvider();

var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();

var version = require("../../lib/version.js");
var currentVersion = new version();


describe("configsProvider", function()
{
	it("add/get/update/delete", function(done)
	{
		createConfig(function() { done(); });
	});
});


function createConfig(callback)
{
	var name = random.getRandomHexText(32);
	var value = random.getRandomHexText(32);


	configsProv.create(name,value, function(error, result)
	{
		should.equal(result.insertId > 0, true);
		getConfig(name, value,	 callback);
	});
}


function getConfig(name, value, callback)
{
	// update the AppVersion to test clearing the cache
	currentVersion.update(function(error, result)
	{
		configsProv.get(name, function(error, results)
		{
			should.equal(error, null);

			var result = results[0];

			results.length.should.equal(1);
			result.id.should.not.equal(null);
			result.uuid.shouldbeUUID;
			result.name.should.equal(name);
			result.value.should.equal(value);

			result.date_added.shouldbeDate;
			result.last_modified.shouldbeDate;
	
			updateConfig(result, callback);
		});
	});
}


function updateConfig(result, callback)
{
	var value = random.getRandomHexText(32);


	configsProv.update(result.name,value, function(error, updateResult)
	{	
		updateResult.affectedRows.should.equal(1);
		getUpdatedConfig(result.name,value, callback);
	});
}



function getUpdatedConfig(name, value, callback)
{
	// update the AppVersion to test clearing the cache
	currentVersion.update(function(error, result)
	{
		configsProv.get(name, function(error, results)
		{
			should.equal(error, null);

			var result = results[0];


			results.length.should.equal(1);
			result.id.should.not.equal(null);
			result.uuid.shouldbeUUID;
			result.name.should.equal(name);
			result.value.should.equal(value);

			result.date_added.shouldbeDate;
			result.last_modified.shouldbeDate;
	
			removeConfig(result, callback);
		});
	});
}

function removeConfig(result, callback)
{
	configsProv.remove(result.name, function(error, result)
	{	
		result.affectedRows.should.equal(1);
		callback();
	});
}


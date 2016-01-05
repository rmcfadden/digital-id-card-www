var config = require("../config");
var memcached = require("memcached");
var version = require("./version");
var currentVersion = new version();

function cache()
{
	this.type = "memcached";
	this.isEnabled = true;
	this.location = "localhost:11211";
	this.lifetime = 86400;
	this.includeAppVersion = true;



	this.get = function(name, callback)
	{
		if(!this.isEnabled)
		{
			callback(null, false);
			return;	
		}

		if(name == "" || name == null)
		{
			callback("name cannot be empty");
			return;		
		}

		var formattedName = this.internalGetName(name);

		this.internalGet(formattedName, callback);
	}


	this.set = function(name, value, callback)
	{

		if(!this.isEnabled)
		{
			callback(null);
			return;		
		}


		if(name == "" || name == null)
		{
			callback("name cannot be empty");
			return;		
		}


		if(value === undefined)
		{
			callback("value must be defined");
			return;		
		}



		var formattedName = this.internalGetName(name);

		this.internalSet(formattedName, value, callback); 
	}


	this.clear = function(callback)
	{
		this.internalClear(callback); 
	}


	this.initialize = function()
	{
		if(config.cache)
		{
			var cache = config.cache;
			if(cache.type)
				this.type = cache.type;

			if(cache.location)
				this.location = cache.location;

			if(cache.lifetime)
				this.lifetime = cache.lifetime;

			if(cache.isEnabled)
				this.isEnabled = cache.isEnabled;

			if(cache.includeAppVersion)
				this.includeAppVersion = cache.includeAppVersion;
		}
	}


	this.internalClear = function(callback)
	{
		if(this.type != "memcached")
		{
			callback("only memcached is currently supported", null);
			return;		
		}

		var currentMemcached = new memcached(this.location);
		currentMemcached.flush(function( error )
		{			
			callback(error);
		});
	}


	this.internalGet = function(name, callback)
	{
		if(this.type != "memcached")
		{
			callback("only memcached is currently supported", null);
			return;		
		}

		var currentMemcached = new memcached(this.location);

		currentMemcached.get(name, function( error, result )
		{			
			callback(error, result);
		});
	}
	

	this.internalSet = function(name, value, callback)
	{
		if(this.type != "memcached")
		{
			callback("only memcached is currently supported", null);
			return;		
		}

		var currentMemcached = new memcached(this.location);

		currentMemcached.set(name, value, this.lifetime, function(error)
		{
			callback(error);
		});

	}


	this.internalGetName = function(name)
	{
		if(this.includeAppVersion)
			return name + "-version-" + currentVersion.current(); 

		return name;
	}

	this.initialize();

}


module.exports = cache;

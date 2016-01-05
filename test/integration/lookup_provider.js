/*
var should = require("should");

var random = require("../../lib/random");


var lookupProvider = require("../../lib/providers/lookup_provider");

var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();

var lookupProv = new lookupProvider();

describe("lookupProvider", function()
{
	before(function( done )
	{
    		lookupProv.setup(function(error)
		{
			should.equal(error, null);  
			done(); 
		} );
	});


	it("getMax/add/get/update/getremove for users colllection", function(done)
	{
		getMaxUser(function() { done(); });
	});


	it("getMax/add/get/remove for resources colllection", function(done)
	{
		getMaxResource(function() { done(); });
	});

});


function getMaxUser(callback)
{
	lookupProv.getMax("users", "user_id", function(error, result)
	{
		should.equal((result >= -1), true);
		addUser(result + 1, callback);		
	});
}


function addUser(user_id, callback)
{
	var email = random.getRandomHexText(32) + "test'@test.com";

	lookupProv.add("users", { user_id: user_id, email: email}, function(error, results)
	{
		results.length.should.equal(1);
		results[0].user_id.should.equal(user_id);
		results[0].email.should.equal(email);

		getUserByUserId(results[0], callback);		
	});
}


function getUserByUserId(user, callback)
{

	lookupProv.get("users", { user_id: user.user_id }, function(error, results)
	{
		results.length.should.equal(1);
		results[0].user_id.should.equal(user.user_id);
		results[0].email.should.equal(user.email);

		getUserByEmail(user, callback);		
	});
}


function getUserByEmail(user, callback)
{

	lookupProv.get("users", { email: user.email }, function(error, results)
	{
		results.length.should.equal(1);
		results[0].user_id.should.equal(user.user_id);
		results[0].email.should.equal(user.email);

		updateUserByEmail(user, callback);		
	});
}


function updateUserByEmail(user, callback)
{
	
	var newEmail = user.email + "asdfsa";

	lookupProv.update("users", { email: user.email }, { email: newEmail }, function(error, result)
	{
		result.should.equal(1);
		getUpdateUserByEmail(user, newEmail, callback);		
	});
}


function getUpdateUserByEmail(user, email, callback)
{

	lookupProv.get("users", { email: email }, function(error, results)
	{

		results.length.should.equal(1);
		results[0].user_id.should.equal(user.user_id);
		results[0].email.should.equal(email);


		removeUser(user, callback);		
	});
}



function removeUser(user, callback)
{
	lookupProv.remove("users", { user_id: user.user_id }, function(error, results)
	{	
		results.should.equal(1);

		callback();
	});
}



function getMaxResource(callback)
{
	lookupProv.getMax("resources", "resource_id", function(error, result)
	{
		should.equal((result >= -1), true);
		addResource(result + 1, callback);		
	});
}


function addResource(resource_id, callback)
{
	var hashtag = random.getRandomHexText(32);
	var user_id = Math.floor(( Math.random()*100000 ) + 1);

	lookupProv.add("resources", { resource_id: resource_id, hashtag: hashtag, user_id: user_id}, function(error, results)
	{
		results.length.should.equal(1);
		results[0].resource_id.should.equal(resource_id);
		results[0].user_id.should.equal(user_id);
		results[0].hashtag.should.equal(hashtag);

		getResourceByResourceId(results[0], callback);		
	});
}


function getResourceByResourceId(resource, callback)
{

	lookupProv.get("resources", { resource_id: resource.resource_id }, function(error, results)
	{
		results.length.should.equal(1);
		results[0].resource_id.should.equal(resource.resource_id);
		results[0].hashtag.should.equal(resource.hashtag);
		results[0].user_id.should.equal(resource.user_id);

		getResourceByHashtag(resource, callback);		
	});
}


function getResourceByHashtag(resource, callback)
{

	lookupProv.get("resources", { hashtag : resource.hashtag }, function(error, results)
	{
		results.length.should.equal(1);
		results[0].resource_id.should.equal(resource.resource_id);
		results[0].hashtag.should.equal(resource.hashtag);

		removeResource(resource, callback);		
	});
}


function removeResource(resource, callback)
{
	lookupProv.remove("resources", { resource_id: resource.resource_id }, function(error, results)
	{	
		results.should.equal(1);

		callback()
	});
}

*/
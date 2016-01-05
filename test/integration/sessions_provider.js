var should = require("should");
var sessionsProvider = require("../../lib/providers/sessions_provider");
var random = require("../../lib/random");
var ip = require("ip");
var moment = require("moment");
var config = require("../../config");
var dateTime = require("../../lib/date_time");

var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();

var repositoryFactory = require("../../lib/repository_factory.js");
var factory = new repositoryFactory();

var sessionsProv = new sessionsProvider();

var clientIp = "8.8.8.8";

describe("sessionsProvider", function()
{
	it("when calling newSession/getSession/updateSession with valid parameters on on sessionsProv", function(done)
	{
		testUtil.createTestUser(function(error, result)
		{
			result.user_id.should.not.equal(-1);			
			newSession(result.user_id, function() { done(); });
		});
	});

});


function newSession(user_id, callback)
{
	sessionsProv.newSession(user_id, clientIp, function(error, result)
	{	
		verifySession(result, callback);
	});
}


function verifySession(result, callback)
{
	should.notEqual(result, null);


	result.id.should.not.equal(null);
	result.uuid.shouldbeUUID;


	result.user_id.should.not.equal(-1);
	ip.fromLong(result.ip_address).should.equal(clientIp);

	var durationSeconds = 2592000;
	if(config.session && config.session.durationSeconds)
		durationSeconds = config.session.durationSeconds;


	moment(result.start_time).format("YYYY-MM-DD").should.equal(moment(dateTime.utcNow()).format("YYYY-MM-DD"));
	moment(result.end_time).format("YYYY-MM-DD").should.equal(moment(dateTime.utcNow()).add("seconds",durationSeconds).format("YYYY-MM-DD"));
	moment(result.last_activity_time).utc().format("YYYY-MM-DD").should.equal(moment(dateTime.utcNow()).format("YYYY-MM-DD"));

	result.hit_count.should.equal(1);
	result.is_expired.should.equal(false);

	
	result.date_added.shouldbeDate;
	result.last_modified.shouldbeDate;

	var token = sessionsProv.extractAccessTockenInfo(result.accessToken);
	token.uuid.should.equal(result.uuid);
	token.user_id.should.equal(result.user_id);
	

	updateSession(result.id, callback);
}


function updateSession(id, callback)
{
	sessionsProv.updateSession(id,  function(error, result)
	{	
		result.user_id.should.not.equal(-1);

		verifyUpdatedSession(id, result.user_id, callback)
	});
}


function verifyUpdatedSession(id, user_id, callback)
{
	sessionsProv.getSession(id,  function(error, result)
	{		
		should.equal(error, null);
		should.notEqual(result, null);
		
		result.id.should.not.equal(null);
		result.uuid.shouldbeUUID;

		result.user_id.should.equal(user_id);
		ip.fromLong(result.ip_address).should.equal(clientIp);

		var durationSeconds = 2592000;
		if(config.session && config.session.durationSeconds)
			durationSeconds = config.session.durationSeconds;

		moment(result.start_time).format("YYYY-MM-DD").should.equal(moment.utc().format("YYYY-MM-DD"));
		moment(result.end_time).format("YYYY-MM-DD").should.equal(moment.utc().add("seconds",durationSeconds).format("YYYY-MM-DD"));
		moment(result.last_activity_time).utc().format("YYYY-MM-DD").should.equal(moment.utc().format("YYYY-MM-DD"));
	
		result.hit_count.should.equal(2);
		result.is_expired.should.equal(false);

		result.date_added.shouldbeDate;
		result.last_modified.shouldbeDate;

		var token = sessionsProv.extractAccessTockenInfo(result.accessToken);
		token.uuid.should.equal(result.uuid);
		token.user_id.should.equal(result.user_id);	
		
		TestgetSessionByUuid(token.uuid, callback);
	});
}


function TestgetSessionByUuid(uuid, callback)
{
	sessionsProv.getSessionByUuid(uuid,  function(error, result)
	{

		should.equal(error, null);
		should.notEqual(result, null);
		
		result.id.should.not.equal(null);
		result.uuid.shouldbeUUID;

		result.user_id.should.not.equal(null);
		ip.fromLong(result.ip_address).should.equal(clientIp);

		var durationSeconds = 2592000;
		if(config.session && config.session.durationSeconds)
			durationSeconds = config.session.durationSeconds;

		moment(result.start_time).format("YYYY-MM-DD").should.equal(moment.utc().format("YYYY-MM-DD"));
		moment(result.end_time).format("YYYY-MM-DD").should.equal(moment.utc().add("seconds",durationSeconds).format("YYYY-MM-DD"));
		moment(result.last_activity_time).utc().format("YYYY-MM-DD").should.equal(moment.utc().format("YYYY-MM-DD"));
	
		result.hit_count.should.equal(2);
		result.is_expired.should.equal(false);

		result.date_added.shouldbeDate;
		result.last_modified.shouldbeDate;

		var token = sessionsProv.extractAccessTockenInfo(result.accessToken);
		token.uuid.should.equal(result.uuid);
		token.user_id.should.equal(result.user_id);	
		
		deleteSession(result, callback);
	});
}


function deleteSession(item, callback)
{
	factory.create( {modelName: "session" }, function(error, repo)
	{
		repo.remove(item, function(error, results) 
		{ 
			results.affectedRows.should.be.equal(1);
			results.changedRows.should.be.equal(0);


			testUtil.removeTestUser({ id: item.user_id }, function(errors, results)
			{

				callback(errors, results);
			});
		});		
	});
}

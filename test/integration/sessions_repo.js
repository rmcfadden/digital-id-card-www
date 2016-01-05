var should = require("should");
var random = require("../../lib/random.js");
var testUtils = require("../../lib/test_utils.js");
var deepcopy = require("deepcopy");
var ip = require("ip");

var repositoryFactory = require("../../lib/repository_factory.js");
var factory = new repositoryFactory();

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();


var newSession = 
{ 

	user_id : 84,
	ip_address : ip.toLong("127.0.0.1")
};




describe("sessionsRepo", function()
{
	it("object", function(done)
	{
		factory.create({ modelName: "session" }, function(error, repo)
		{
			should.notEqual(repo, null);
			done();
		});
	});


	it("when adding/reading/update/deleting a session", function(done)
	{		
		testCreateSession(function(error, result) { done(); } );
	});
});


function testCreateSession(callback)
{
	testUtil.createTestUser(function(errors, result)
	{
		factory.create({ modelName: "session" }, function(error, repo)
		{
			newSession.user_id = result.user_id;
			repo.create(newSession, function(error, result) 
			{

				should.equal(error, null);
				should.notEqual(result.insertId, null);

				testReadSession(repo, result.insertId, callback);
			});
		});
	});
}


function testReadSession(repo, id, callback)
{


	repo.findById(id, function(error, results) 
	{ 
		should.equal(error, null);


		var result = results[0];
		results.length.should.equal(1);
		result.id.should.not.equal(null);
		result.uuid.shouldbeUUID;

		result.user_id.should.equal(newSession.user_id);
		ip.fromLong(result.ip_address).should.equal("127.0.0.1");

		result.last_activity_time.should.equal("1000-01-01T00:00:00+00:00");
		
		result.start_time.should.equal("1000-01-01T00:00:00+00:00");
		result.end_time.should.equal("1000-01-01T00:00:00+00:00");

		result.hit_count.should.equal(0);
		result.is_expired.should.equal(false);

		

		result.date_added.shouldbeDate;
		result.last_modified.shouldbeDate;

		testUpdateSession(repo, result, callback);

	});
}


function testUpdateSession(repo, session, callback)
{
	var updateSession = deepcopy(session);

	updateSession.ip_address = ip.toLong("8.8.8.8");
	updateSession.hit_count++;
	updateSession.is_expired = true;
	updateSession.last_activity_time = "2001-2-2 2:3:30";
	updateSession.start_time = "2001-2-2 2:3:30";
	updateSession.end_time = "2011-3-3 3:3:30";

	repo.update(updateSession, function(error, results) 
	{ 
		results.affectedRows.should.be.equal(1);
		results.changedRows.should.be.equal(1);

		testReadUpdatedSession(repo, updateSession.id, callback)
	});
}


function testReadUpdatedSession(repo, id, callback)
{
	repo.findById(id, function(error, results) 
	{ 
		should.equal(error, null);

		var result = results[0];
		
		results.length.should.equal(1);
		result.id.should.not.equal(null);
		result.uuid.shouldbeUUID;

		result.user_id.should.equal(newSession.user_id);
		ip.fromLong(result.ip_address).should.equal("8.8.8.8");

		result.last_activity_time.should.equal("2001-02-02T02:03:30+00:00");
		result.start_time.should.equal("2001-02-02T02:03:30+00:00");
		result.end_time.should.equal("2011-03-03T03:03:30+00:00");

		result.hit_count.should.equal(1);
		result.is_expired.should.equal(true);

		result.date_added.shouldbeDate;
		result.last_modified.shouldbeDate;

	
		testReadSessionByUuid(repo, result.uuid, callback);

	});
}



function testReadSessionByUuid(repo, uuid, callback)
{
	repo.findByUuid(uuid, function(error, results) 
	{ 
		should.equal(error, null);

		results.length.should.equal(1);
		var result = results[0];
		
		result.id.should.not.equal(null);
		result.uuid.shouldbeUUID;

		result.user_id.should.equal(newSession.user_id);
		ip.fromLong(result.ip_address).should.equal("8.8.8.8");

		result.last_activity_time.should.equal("2001-02-02T02:03:30+00:00");
		result.start_time.should.equal("2001-02-02T02:03:30+00:00");
		result.end_time.should.equal("2011-03-03T03:03:30+00:00");

		result.hit_count.should.equal(1);
		result.is_expired.should.equal(true);

		result.date_added.should.be.an.instanceof(String);
		result.last_modified.should.be.an.instanceof(String);

	
		testRemoveSession(repo, result, callback);

	});
}


function testRemoveSession(repo, result, callback)
{
	repo.remove(result, function(error, results) 
	{ 
		results.affectedRows.should.be.equal(1);
		results.changedRows.should.be.equal(0);


		testUtil.removeTestUser({ id: result.user_id }, function(errors, results)
		{

			callback(errors, results);
		});
	});
}



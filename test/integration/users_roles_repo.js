var should = require("should");
var random = require("../../lib/random");
var testUtils = require("../../lib/test_utils");
var deepcopy = require("deepcopy");

var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();


var repositoryFactory = require("../../lib/repository_factory");
var factory = new repositoryFactory();

var usersProvider = require("../../lib/providers/users_provider");
var usersProv = new usersProvider();



describe("users_roles_Repo", function()
{
	it("object", function(done)
	{
		factory.create({modelName: "users_role" }, function(error, repo)
		{
			should.notEqual(repo, null);
			done();
		});
	});


	it("when adding/reading/update/deleting a user", function(done)
	{
		testCreateUserRole(function(error, result) { done(); } );
	});
});

function createUserIdGetRandomRole(callback)
{
	testUtil.createTestUser(function(error, result)
	{
		should.equal(error, null);
		result.user_id.should.not.equal(-1);

		factory.create({ modelName: "role" }, function(error, repo)
		{

			repo.findAll(function(error, results)
			{

				var RandomRole = results[Math.floor(Math.random() * results.length)];				

				should.notEqual(RandomRole, null);
				should.notEqual(RandomRole.id, null);
			
				callback(null, {"user_id" : result.user_id, "role_id" : RandomRole.id});
			});
			
		});

	});	
}


function testCreateUserRole(callback)
{	
	createUserIdGetRandomRole(function(error, result)
	{
		factory.create({ modelName: "users_role" }, function(error, repo)
		{
			repo.create(result,  function(error, addResult)
			{
				addResult.insertId.should.not.equal(-1);
				addResult.affectedRows.should.equal(1);
				

				testReadUsersRole(repo, addResult.insertId, result, callback);
			});
		});

		
		
	});
}



function testReadUsersRole(repo, id, userRole, callback)
{
	repo.findById(id, function(error, results) 
	{ 
		should.equal(error, null);

		var result = results[0];


		results.length.should.equal(1);

		result.id.should.not.equal(null);
		result.uuid.shouldbeUUID;

		result.user_id.should.equal(userRole.user_id);
		result.role_id.should.equal(userRole.role_id);

		result.date_added.shouldbeDate;
		result.last_modified.shouldbeDate;

		testRemoveUsersRole(repo, result, callback);

	});
}

// todo get by user_id/role_id


function testRemoveUsersRole(repo, result, callback)
{
	repo.remove(result, function(error, results) 
	{ 
		results.affectedRows.should.be.equal(1);
		results.changedRows.should.be.equal(0);

		testUtil.removeTestUser({ id: result.user_id },  function(error, results)
		{
			callback(error, results);
		});
	});
}



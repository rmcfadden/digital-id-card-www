var should = require("should");
var random = require("../../lib/random.js");
var deepcopy = require("deepcopy");

var repositoryFactory = require("../../lib/repository_factory.js");
var factory = new repositoryFactory();

var testUtils = require("../../lib/test_utils.js");
var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();


var version = require("../../lib/version.js");
var currentVersion = new version();

var name = "role-" + random.getRandomHexText(5);

var newRole = 
{ 
	name: name
};


describe("roleRepo", function()
{
	it("object", function(done)
	{
		factory.create({modelName: "role", connectionName: "user"}, function(error, repo)
		{
			should.notEqual(repo, null);
			done();
		});
	});


	it("when adding/reading/update/deleting a role", function(done)
	{
		factory.create({modelName: "role", connectionName: "user"}, function(error, repo)
		{
			testCreateRole(repo, function(error, result) { done(); } );
		});
	});
});


function testCreateRole(repo, callback)
{
	repo.create(newRole, function(error, result) 
	{ 
		should.equal(error, null);
		should.notEqual(result.insertId, null);

		testReadRole(repo, result.insertId, callback);
	});
}


function testReadRole(repo, id, callback)
{
	// update the AppVersion to test clearing the cache
	currentVersion.update(function(error, result)
	{
		repo.findById(id, function(error, results) 
		{ 
			should.equal(error, null);

			var result = results[0];

			results.length.should.equal(1);
			result.id.should.not.equal(null);
			result.uuid.shouldbeUUID;
			result.name.should.equal(name);

			result.date_added.shouldbeDate;
			result.last_modified.shouldbeDate;

			testUpdateRole(repo,result, callback);
		});
	});
}


function testUpdateRole(repo, role, callback)
{
	var updateRole = deepcopy(role);

	updateRole.name += "1";
	repo.update(updateRole, function(error, results) 
	{ 
		results.affectedRows.should.be.equal(1);
		results.changedRows.should.be.equal(1);

		testReadUpdatedRole(repo, updateRole.id, callback)
	});
}


function testReadUpdatedRole(repo, id, callback)
{
	// update the AppVersion to test clearing the cache
	currentVersion.update(function(error, result)
	{
		repo.findById(id, function(error, results) 
		{ 
			should.equal(error, null);

			var result = results[0];
		
			results.length.should.equal(1);

			result.id.should.not.equal(null);
			result.uuid.shouldbeUUID;

			result.name.should.equal(name + "1");

			result.date_added.shouldbeDate;
			result.last_modified.shouldbeDate;
	
			testDeleteRole(repo, result, callback);

		});
	});
}


function testDeleteRole(repo, result, callback)
{
	// update the AppVersion to test clearing the cache
	currentVersion.update(function(error, updateResult)
	{
		repo.remove(result, function(error, results) 
		{ 

			results.affectedRows.should.be.equal(1);
			results.changedRows.should.be.equal(0);

			callback(error, results);
		});
	});
}



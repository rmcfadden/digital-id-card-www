var should = require("should");

var repositoryFactory = require("../../lib/repository_factory.js");
var factory = new repositoryFactory();

var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();

var authorizationProvider = require("../../lib/providers/authorization_provider.js");

var authProvider = new authorizationProvider();

describe("authorizationProvider", function()
{
	describe("getRoles", function()
	{
		it("when a callback parameter is provided", function(done)
		{
			authProvider.getRoles(function(error, results)
			{
				should.equal(results.length > 1, true);
				results[0].id.should.equal(1);
				results[0].name.should.equal("admin");
				
				done();

			});
		});
	});


	describe("getRolesNameLookup", function()
	{
		it("when a callback parameter is provided", function(done)
		{
			authProvider.getRolesNameLookup(function(error, result)
			{
				result.admin.should.equal(1);
				result.support.should.equal(2);
				
				done();

			});
		});
	});


	describe("getRoleIdByRoleName", function()
	{
		it("when a role that exists is provided", function(done)
		{
			authProvider.getRoleIdByRoleName("admin", function(error, result)
			{
				result.should.equal(1);
				
				done();

			});
		});

		it("when a role that does not exists is provided", function(done)
		{
			authProvider.getRoleIdByRoleName("adminasdfasdf", function(error, result)
			{
				error.should.equal("cannot find role adminasdfasdf");
				
				done();

			});
		});
	});


	it("when calling addRole/canAccessRole/canAccessRoles/removeRoles with valid parameters on the authorizationProvider", function(done)
	{
		testUtil.createTestUser(function(error, result)
		{
			result.user_id.should.not.equal(-1);			
			addUserRole(result.user_id, function() { done(); });
		});
	});

});


function addUserRole(user_id, callback)
{
	authProvider.addRoles(user_id, ["admin", "support"], function(error, results)
	{
		should.equal((results.length == 2), true);
		checkCanAccessUserRole(user_id, callback);
	});
}



function checkCanAccessUserRole(user_id, callback)
{
	authProvider.canAccessRole(user_id, "admin", function(error, result)
	{			
		result.should.equal(true);
		checkCanAccessUserRoles(user_id, callback);
	});
}


function checkCanAccessUserRoles(user_id, callback)
{
	authProvider.canAccessRoles(user_id, ["admin","asdf"], function(error, result)
	{			
		result.should.equal(true);
		checkCanAccessUserRolesFails(user_id, callback);
	});
}


function checkCanAccessUserRolesFails(user_id, callback)
{
	authProvider.canAccessRoles(user_id, ["asdfasdf1","asdf"], function(error, result)
	{	
		
		result.should.equal(false);
		removeRoles(user_id, callback);
	});
}

function removeRoles(user_id, callback)
{
	authProvider.removeRole(user_id, "admin", function(error, result)
	{			
		result.affectedRows.should.equal(1);
		authProvider.removeRole(user_id, "support", function(error, result)
		{			
			result.affectedRows.should.equal(1);
			testUtil.removeTestUser({id: user_id}, function(error, result)
			{
				callback();
			});
		});
	});

}


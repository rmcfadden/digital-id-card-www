var repositoryFactory = require("../../lib/repository_factory.js");
var factory = new repositoryFactory();

var async = require("async");

var authenticationProvider = function()
{
	this.canAccessRole = function (user_id, roleName, callback)
	{
		this.getRoleIdByRoleName(roleName, function(error, roleId)
		{
			if(error)
			{
				callback(error, null);
				return;			
			}

			factory.create({modelName: "users_role" }, function(error, repo)
			{
				repo.find({ "user_id" : user_id, "role_id" : roleId }, function(error, results) 
				{ 
					if(error)
					{
						callback(error, null);
						return;			
					}

					
					callback(error, (results.length > 0));
				});
			});
		});
	}


	this.canAccessRoles = function(user_id, roleNames, callback)
	{
		this.getRolesNameLookup(function(error, lookup)
		{
			if(error)
			{
				callback(error, null);
				return;			
			}

			var roleIds = [];
			for(var i=0; i < roleNames.length; i++)
			{
				var roleName = roleNames[i];
				if(lookup[roleName])
					roleIds.push({ role_id : lookup[roleName] });
			}

	
			if(roleIds.length == 0)
			{
				callback(null, false);
				return;			
			}


			factory.create({ modelName: "users_role" }, function(error, repo)
			{
				var findCriteria = 
				{
					"user_id" : user_id,
					"or" : roleIds	
				};

				repo.find(findCriteria, function(error, results) 
				{ 
					if(error)
					{
						callback(error, null);
						return;			
					}

					callback(error, (results.length > 0));
				});
			});
		});
	}


	this.addRole = function(user_id, role, callback)
	{
		this.getRoleIdByRoleName(role, function(error, roleId)
		{
			if(error)
			{
				callback(error, null);
				return;			
			}

			factory.create({modelName: "users_role" }, function(error, repo)
			{
				repo.create({ "user_id" : user_id, "role_id" : roleId }, function(error, result) 
				{ 
					callback(error, result);
				});
			});
		});
	}


	this.addRoles = function(user_id, roles, callback)
	{
		var proxyThis = this;
		var results = [];
		async.each(roles, function(role, finishedCallback) 
		{
			proxyThis.addRole(user_id, role, function(error, result)
			{
				if(error)
				{
					finishedCallback(error);
				}
				else
				{
					results.push(result.insertId);
					finishedCallback();
				}
			});
		},
		function(error)
		{
			if(error)
			{
				callback(error, null);			
			}
			else
			{
				callback(null, results);						
			}
		});
	}



	this.removeRole = function(user_id, roleName, callback)
	{
		this.getRoleIdByRoleName(roleName, function(error, roleId)
		{
			factory.create({modelName: "users_role" }, function(error, repo)
			{
				repo.removeBy({ "user_id" : user_id, "role_id" : roleId }, function(error, result) 
				{ 
					callback(error, result);
				});
			});
		});
	}



	this.getRoles = function(callback)
	{
		factory.create({modelName: "role" }, function(error, repo)
		{
			repo.findAll(function(error, results) 
			{ 
				callback(error, results);
			});
		});
	}


	this.getRolesNameLookup = function(callback)
	{

		factory.create({modelName: "role" }, function(error, repo)
		{
			repo.getNamesLookup(function(error, results) 
			{ 
				callback(error, results);
			});
		});
	}


	this.getRoleIdByRoleName = function(roleName, callback)
	{

		factory.create({modelName: "role" }, function(error, repo)
		{
			repo.getNamesLookup(function(error, rolesLookup) 
			{ 
				if(error)
				{
					callback(error, null);
					return;			
				}


				if(!rolesLookup[roleName])
				{
					callback("cannot find role " + roleName, null);
					return;			
				}

				var roleId = rolesLookup[roleName];

				callback(error, roleId);
			});
		});
	}

}

module.exports = authenticationProvider;

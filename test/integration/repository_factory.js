var should = require("should");
var repositoryFactory = require("../../lib/repository_factory.js");

var factory = new repositoryFactory();

var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();


describe("repository_factory", function()
{
	describe("create", function()
	{
		it("when args is not null", function(done)
		{
			factory.create({ modelName : "user_test", connectionName: "user"}, function(error, repo)
			{
				// should verify that findBy methods exist
				repo.findById.should.not.equal(null);		
				repo.findByUuid.should.not.equal(null);		

				repo.findByEmail.should.not.equal(null);		
				repo.findByPassword.should.not.equal(null);		
				repo.findByPassword_salt.should.not.equal(null);		

				repo.findByIs_active.should.not.equal(null);		


				repo.findByDate_added.should.not.equal(null);		
				repo.findByLast_modified.should.not.equal(null);		


				// should verify that updateSet methods exist
				repo.updateSetId.should.not.equal(null);		
				repo.updateSetUuid.should.not.equal(null);		

				repo.updateSetEmail.should.not.equal(null);		
				repo.updateSetPassword.should.not.equal(null);		
				repo.updateSetPassword_salt.should.not.equal(null);		

				repo.updateSetIs_active.should.not.equal(null);		


				repo.updateSetDate_added.should.not.equal(null);		
				repo.updateSetLast_modified.should.not.equal(null);	

		
				done();
			});
		});



	
	});
});

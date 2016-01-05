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
		it("when args is null", function(done)
		{
			factory.create(null, function(error, result)
			{
				error.should.equal("args cannot be null");
				done();
			});
		});


		it("when args model is null", function(done)
		{
			factory.create({}, function(error, result)
			{
				error.should.equal("model cannot be null");
				done();
			});
		});



		it("when args connectionInfo.type is null", function(done)
		{
			factory.create({ model : {}, connectionInfo: {}}, function(error, result)
			{
				error.should.equal("connectionInfo.type must be defined");
				done();
			});

		});


		// only mysql supported now
		it("when args connectionInfo.type is mysql", function(done)
		{
			factory.create({ model : {}, connectionInfo: { type: "mysql1"}}, function(error, result)
			{
				error.should.equal("Cannot find data provider: mysql1");
				done();
			});
		});


		it("when args is valid", function(done)
		{
			factory.create({ model : {name : "user"}, connectionInfo: { type: "mysql"}}, function(error, result)
			{
				should.notEqual(result, null);
				done();
			});
		});


		it("when args.modelName does not exist", function(done)
		{
			factory.create({ modelName : "user1", connectionInfo: { type: "mysql"}}, function(error, result)
			{
				error.should.equal("Cannot find module '../model/user1'");
				done();
			});
		});



		it("when args.modelName exists", function(done)
		{		
			factory.create({ modelName : "user", connectionInfo: { type: "mysql"}}, function(error, result)
			{
				should.notEqual(result, null);
				done();
			});
		});


		it("when args.connectionName does not exist", function(done)
		{
			factory.create({ modelName : "user", connectionName : "user1" }, function(error, result)
			{
				error.should.equal("user1_test not found in connections");
				done();
			});


		});


		it("when args.connectionName exists", function(done)
		{

			factory.create({ modelName : "user", connectionName: "user"}, function(error, result)
			{
				should.notEqual(result, null);
				done();
			});
		});


	
	});
});

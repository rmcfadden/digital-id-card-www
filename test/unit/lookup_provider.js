var should = require("should");
var lookupProvider = require("../../lib/providers/lookup_provider");

var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();

var lookupProv = new lookupProvider();

describe("lookupProvider", function()
{



	it("object", function(done)
	{
		should.notEqual(lookupProv, null);
		done();
	});

	describe("get", function()
	{

		it("when an empty collectionName parameter is passed", function(done)
		{
			lookupProv.get(null, null, function(error, result)
			{
				error.should.equal("collectionName parameter cannot be empty");
				done();		
			});
		});


		it("when an empty query parameter is passed", function(done)
		{
			lookupProv.get("asdf", null, function(error, result)
			{
				error.should.equal("query parameter cannot be empty");
				done();		
			});
		});
	});


	describe("add", function()
	{
		it("when an empty collectionName parameter is passed", function(done)
		{
			lookupProv.add(null, null, function(error, result)
			{
				error.should.equal("collectionName parameter cannot be empty");
				done();		
			});
		});


		it("when an empty item parameter is passed", function(done)
		{
			lookupProv.add("Adsf", null, function(error, result)
			{
				error.should.equal("item parameter cannot be empty");
				done();		
			});
		});


	});


	describe("update", function()
	{
		it("when an empty collectionName parameter is passed", function(done)
		{
			lookupProv.update(null, null, null, function(error, result)
			{
				error.should.equal("collectionName parameter cannot be empty");
				done();		
			});
		});


		it("when an empty item parameter is passed", function(done)
		{
			lookupProv.update("Adsf", "Asdfa", null, function(error, result)
			{
				error.should.equal("item parameter cannot be empty");
				done();		
			});
		});


		it("when an empty key parameter is passed", function(done)
		{
			lookupProv.update("Adsf", null, null, function(error, result)
			{
				error.should.equal("key parameter cannot be empty");
				done();		
			});
		});


	})


	describe("getMax", function()
	{
		it("when an empty collectionName parameter is passed", function(done)
		{
			lookupProv.getMax(null, null, function(error, result)
			{
				error.should.equal("collectionName parameter cannot be empty");
				done();		
			});
		});


		it("when an empty column parameter is passed", function(done)
		{
			lookupProv.getMax("Adsf", null, function(error, result)
			{
				error.should.equal("column parameter cannot be empty");
				done();		
			});
		});


	});


	describe("remove", function()
	{
		it("when an empty collectionName parameter is passed", function(done)
		{
			lookupProv.remove(null, null, function(error, result)
			{
				error.should.equal("collectionName parameter cannot be empty");
				done();		
			});
		});

		it("when an empty query parameter is passed", function(done)
		{
			lookupProv.remove("adsf", null, function(error, result)
			{
				error.should.equal("query parameter cannot be empty");
				done();		
			});
		});


	});


	describe("getDbName", function()
	{
		it("when its called", function(done)
		{
			lookupProv.getDbName().shouldEndWith("_test");
			done();
		});
	});
	

	describe("getPort", function()
	{
		it("when its called", function(done)
		{
			should.equal((lookupProv.getPort() > 0), true);
			done();
		});
	});


});


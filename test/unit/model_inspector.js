var should = require("should");
var modelInspector = require("../../lib/model_inspector.js");
var user_test = require("../../model/user_test.json");

var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();


describe("modelInspector", function()
{	
	it("object", function(done)
	{
		var inspector = new modelInspector();
		should.notEqual(inspector, null);
		done();
	});


	describe("all methods", function()
	{
		it("when model is null", function(done)
		{
			var inspector = new modelInspector();
			should.throws( function() { inspector.getFields(); }, Error);
			done();
		});


		it("when model.name is null", function(done)
		{
			var inspector = new modelInspector();
			inspector.model = {name: null};

			should.throws( function() { inspector.getFields(); }, Error);
			done();
		});


		it("when model.name is empty", function(done)
		{
			var inspector = new modelInspector();
			inspector.model = {name: ""};

			should.throws( function() { inspector.getFields(); }, Error);
			done();
		});


		it("when model name is set", function(done)
		{
			var inspector = new modelInspector();
			inspector.model = {name: "test"};

			should.equal("test", inspector.getName());
			done();
		});

	});


	describe("getName", function()
	{

		it("when user model is set", function(done)
		{
			var inspector = new modelInspector();
			inspector.model = user_test;

			should.equal("user_test", inspector.getName());
			done();
		});

	});



	describe("getPluralizedName", function()
	{

		it("when user model is set", function(done)
		{
			var inspector = new modelInspector();
			inspector.model = user_test;

			should.equal("user_tests", inspector.getPluralizedName());
			done();
		});

	});


	describe("getFields", function()
	{
		it("when user_test model is set", function(done)
		{
			var inspector = new modelInspector();
			inspector.model = user_test;

			var fields = inspector.getFields();
			should.equal(8, fields.length);

			should.equal(user_test.fields[0].name, "email");
			should.equal(user_test.fields[0].type, "string");
			should.equal(user_test.fields[0].length, 160);

			should.equal(user_test.fields[1].name, "password");
			should.equal(user_test.fields[1].type, "string");
			should.equal(user_test.fields[1].length, 128);

			should.equal(user_test.fields[2].name, "password_salt");
			should.equal(user_test.fields[2].type, "string");
			should.equal(user_test.fields[2].length, 128);

			should.equal(user_test.fields[3].name, "is_unsubscribed");
			should.equal(user_test.fields[3].type, "bool");
			should.equal(user_test.fields[3].default, false);

			should.equal(user_test.fields[4].name, "is_active");
			should.equal(user_test.fields[4].type, "bool");
			should.equal(user_test.fields[4].default, false);

			should.equal(user_test.fields[5].name, "is_locked");
			should.equal(user_test.fields[5].type, "bool");
			should.equal(user_test.fields[5].default, false);

			should.equal(user_test.fields[6].name, "last_password_failed_time");
			should.equal(user_test.fields[6].type, "datetime");
			should.equal(user_test.fields[6].default, "minimum");

			should.equal(user_test.fields[7].name, "number_password_failed_attempts");
			should.equal(user_test.fields[7].type, "int");
			should.equal(user_test.fields[7].default, 0);


			done();
		});
	});


	describe("getConventions", function()
	{
		it("when user_test model is set, with a standard_object convention added", function(done)
		{
			var inspector = new modelInspector();
			inspector.model = user_test;
			
			var conventions =  inspector.getConventions();
			should.equal(1, conventions.length);
			should.equal("standard_object", conventions[0]);

			done();			
		});
	});


	describe("containsConvention", function()
	{
		it("when param is null", function(done)
		{
			var inspector = new modelInspector();
			inspector.model = user_test;

			should.throws( function() { inspector.containsConvention();}, Error);
			done();
		});


		it("when param is empty", function(done)
		{
			var inspector = new modelInspector();
			inspector.model = user_test;

			should.throws( function() { inspector.containsConvention("");}, Error);
			done();
		});


		it("when passed convention is not found", function(done)
		{
			var inspector = new modelInspector();
			inspector.model = user_test;

			should.equal(false, inspector.containsConvention("stanadfad"));
			done();
		});


		it("when passed convention is found", function(done)
		{
			var inspector = new modelInspector();
			inspector.model = user_test;

			should.equal(true, inspector.containsConvention("standard_object"));
			done();
		});


	});


	describe("getEffectiveFields", function()
	{
		it("when user_test model is set", function(done)
		{
			var inspector = new modelInspector();
			inspector.model = user_test;

			var fields = inspector.getEffectiveFields();


			should.equal(fields.length, 12);

			should.equal(fields[0].name, "id");
			should.equal(fields[0].type, "long");
			should.equal(fields[0].is_primary_key, true);

			should.equal(fields[1].name, "uuid");
			should.equal(fields[1].type, "uuid");
			should.equal(fields[1].default, "newid");
			should.equal(fields[1].can_update, false);


			should.equal(fields[2].name, "email");
			should.equal(fields[2].type, "string");
			should.equal(fields[2].length, 160);


			should.equal(fields[3].name, "password");
			should.equal(fields[3].type, "string");
			should.equal(fields[3].length, 128);

			should.equal(fields[4].name, "password_salt");
			should.equal(fields[4].type, "string");
			should.equal(fields[4].length, 128);

			should.equal(fields[5].name, "is_unsubscribed");
			should.equal(fields[5].type, "bool");
			should.equal(fields[5].default, false);

			should.equal(fields[6].name, "is_active");
			should.equal(fields[6].type, "bool");
			should.equal(fields[6].default, false);

			should.equal(fields[7].name, "is_locked");
			should.equal(fields[7].type, "bool");
			should.equal(fields[7].default, false);

			should.equal(fields[8].name, "last_password_failed_time");
			should.equal(fields[8].type, "datetime");
			should.equal(fields[8].default, "minimum");

			should.equal(fields[9].name, "number_password_failed_attempts");
			should.equal(fields[9].type, "int");
			should.equal(fields[9].default, 0);

			should.equal(fields[10].name, "date_added");
			should.equal(fields[10].type, "datetime");
			should.equal(fields[10].default, "utcnow");
			should.equal(fields[10].can_update, false);

			should.equal(fields[11].name, "last_modified");
			should.equal(fields[11].type, "timestamp");
			should.equal(fields[11].is_read_only, true);


			done();
		});

	});


});


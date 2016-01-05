var should = require("should");
var queryGenerator = require("../../lib/mysql_query_generator.js");
var userTest = require("../../model/user_test.json");
var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();



describe("queryGenerator", function()
{	
	it("object", function(done)
	{
		var generator = new queryGenerator();
		should.notEqual(generator, null);
		done();
	});


	describe("all methods", function()
	{
		it("when model is null", function(done)
		{
			var generator = new queryGenerator();
			should.throws( function() { generator.generateSelect(); }, Error);
			done();
		});


		it("when model.name is null", function(done)
		{
			var generator = new queryGenerator();
			generator.model = {name: null};
			should.throws( function() { generator.generateSelect(); }, Error);
			done();
		});


		it("when model.name is empty", function(done)
		{
			var generator = new queryGenerator();
			generator.model = {name : "" };
			should.throws( function() { generator.generateSelect(); }, Error);
			done();
		});


		it("when model name is set", function(done)
		{
			var generator = new queryGenerator();
			generator.model = {name: "test"};
			should.notEqual("", generator.generateSelect());
			done();
		});


	});


	describe("generateSelect", function()
	{
		it("when args is null and model is set", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var actualText = generator.generateSelect();
			var expectedText = "select id,uuid,email,password,password_salt,is_unsubscribed,is_active,is_locked,last_password_failed_time,number_password_failed_attempts,date_added,last_modified from user_tests";
			actualText.should.equal(expectedText );

			done();
		});


		it("when args is set to a where clause and model is set", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var actualText = generator.generateSelect({ "password" : "'test''" });
			var expectedText = "select id,uuid,email,password,password_salt,is_unsubscribed,is_active,is_locked,last_password_failed_time,number_password_failed_attempts,date_added,last_modified from user_tests where password = '\\'test\\'\\''";
			actualText.should.equal(expectedText);

			done();
		});
	});


	describe("generateWhereClause", function()
	{
		it("when where is null", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;			
			should.throws( function() { generator.generateWhereClause(); }, Error);

			done();
		});

		it("when args is set to a where clause", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var actualText = generator.generateWhereClause({ "password" : "'test1''" } );
			var expectedText = "where password = '\\'test1\\'\\''";
			actualText.should.equal(expectedText);

			done();
		});

	});


	describe("generatePrimaryKeyWhereClause", function()
	{
		it("when obj is null", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			should.throws( function() { generator.generateWhereClause(); }, Error);

			done();
		});


		it("when obj is set with an id and the model is set", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var actualText = generator.generatePrimaryKeyWhereClause({id: 21});
			var expectedText = "where id = 21";
			
			actualText.should.equal(expectedText);

			done();
		});

	});


	describe("generateCreate", function()
	{
		it("when obj is null", function(done)
		{
			var generator = new queryGenerator();
			should.throws( function() { generator.generateCreate(); }, Error);

			done();
		});


		it("when obj is set to an object and the model is set", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var newUser = 
			{ 
				email: '8729a2dede95e8921ce80eb555663988test\'@test.com',
				password: 'd87a92cc1219b55b648d491164790bd7',
				password_salt: '9db38b98f392e2ab',
				is_unsubscribed: false,
				is_active: false,
				is_locked: false,
				last_password_failed_time: '2014-1-1 1:1:1',
				number_password_failed_attempts: 25
			}
		
			var actualText = generator.generateCreate(newUser);
			var expectedText = "insert into user_tests (uuid,email,password,password_salt,is_unsubscribed,is_active,is_locked,last_password_failed_time,number_password_failed_attempts,date_added) values(uuid(),'8729a2dede95e8921ce80eb555663988test\\'@test.com','d87a92cc1219b55b648d491164790bd7','9db38b98f392e2ab',false,false,false,'2014-1-1 1:1:1',25,utc_timestamp())";

			actualText.should.equal(expectedText);

			done();
		});

	});


	describe("generateUpdate", function()
	{
		it("when obj is null", function(done)
		{
			var generator = new queryGenerator();
			should.throws( function() { generator.generateUpdate(); }, Error);

			done();
		});


		it("when obj is set to an object and the model is set", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var newUser = 
			{ 
				id: 123123123,
				email: '8729a2dede95e8921ce80eb555663988test\'@test.com1',
				password: 'd87a92cc1219b55b648d491164790bd71',
				password_salt: '9db38b98f392e2ab1',
				is_unsubscribed: true,
				is_active: true,
				is_locked: false,
				last_password_failed_time: '2014-1-1 1:1:2',
				number_password_failed_attempts: 97
			}
		
			var actualText = generator.generateUpdate(newUser);	
			var expectedText = "update user_tests set email = '8729a2dede95e8921ce80eb555663988test\\'@test.com1',password = 'd87a92cc1219b55b648d491164790bd71',password_salt = '9db38b98f392e2ab1',is_unsubscribed = true,is_active = true,is_locked = false,last_password_failed_time = '2014-1-1 1:1:2',number_password_failed_attempts = 97 where id = 123123123";

			actualText.should.equal(expectedText);

			done();
		});


		it("when obj is set to an object and the model is set and args is provide with a set array", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var newUser = 
			{ 
				id: 123123123,
			}
		
			var actualText = generator.generateUpdate(newUser, { "set" : { "is_unsubscribed" : false , "is_active" : false } } );	

			var expectedText = "update user_tests set is_unsubscribed = false,is_active = false where id = 123123123";

			actualText.should.equal(expectedText);

			done();
		});


		it("when obj is set to an object and the model is set and args is provide with a set array and a where clause is provided", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var newUser = 
			{ 
			}
		
			var actualText = generator.generateUpdate(newUser, { "set" : { "is_unsubscribed" : false, "is_active" : false }, where : { ne : { email : "asdf@acsd.com" } }   } );	

			var expectedText = "update user_tests set is_unsubscribed = false,is_active = false where email <> 'asdf@acsd.com'";

			actualText.should.equal(expectedText);

			done();
		});


		it("when obj is set to an object and the model is set and args is provide with a set array and a where clause is provided", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var newUser = 
			{ 
			}
		
			var actualText = generator.generateUpdate(newUser, { "set" : { "is_unsubscribed" : false, "is_active" : false }, where : { email : "asdf@acsd.com", is_active: true }  } );	
			var expectedText = "update user_tests set is_unsubscribed = false,is_active = false where (email = 'asdf@acsd.com' and is_active = true)";

			actualText.should.equal(expectedText);

			done();
		});


	});


	describe("generateRemove", function()
	{
		it("when obj is null", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			should.throws( function() { generator.generateRemove(); }, Error);

			done();
		});


		it("when obj is set with an id and the model is set", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var actualText = generator.generateRemove({id: 21});
			var expectedText = "delete from user_tests where id = 21";

			actualText.should.equal(expectedText);

			done();
		});

	});


	describe("generateCriteria", function()
	{
		it("when criteria is null", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			should.throws( function() { generator.generateCriteria(); }, Error);

			done();
		});



		it("when simple number criteria is passed to generateCriteria", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var actualText = generator.generateCriteria({id: 21});
			var expectedText = "id = 21";	
			actualText.should.equal(expectedText);

			done();
		});

		it("when simple string criteria is passed to generateCriteria", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var actualText = generator.generateCriteria({ email : "8729a2dede95e8921ce80eb555663988test\'@test.com1"});


			var expectedText = "email = '8729a2dede95e8921ce80eb555663988test\\'@test.com1'";	
			actualText.should.equal(expectedText);

			done();
		});


		it("when simple bool criteria is passed to generateCriteria", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var actualText = generator.generateCriteria({ "is_unsubscribed" : false});
			

			var expectedText = "is_unsubscribed = false";	
			actualText.should.equal(expectedText);

			done();
		});


		it("when a null string criteria is passed to generateCriteria", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var actualText = generator.generateCriteria({ email : null});

			var expectedText = "email = NULL";	
			actualText.should.equal(expectedText);

			done();
		});

		it("when a list criteria is passed to generateCriteria", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var criteria = 
			{ 
				email : "test@asdf.com",
				"is_unsubscribed" : false 				
				
			};

			var actualText = generator.generateCriteria(criteria);

			var expectedText = "(email = 'test@asdf.com' and is_unsubscribed = false)";	
			actualText.should.equal(expectedText);

			done();
		});


		it("when a compound criteria, without a primary parameter, is passed to generateCriteria", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var criteria = 
			{ 
				"or" : 
				[ 
					{ "is_unsubscribed" : false }, 
					{ "is_active" : true }
				]  
			};

			var actualText = generator.generateCriteria(criteria);
	
			var expectedText = "( is_unsubscribed = false or is_active = true )";	
			actualText.should.equal(expectedText);

			done();
		});

		it("when a complex compound criteria, without a primary parameter, is passed to generateCriteria", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var criteria = 
			{ 
				"email" : "adfasd@asdcasdc.com",
				"or" : 
				[ 
					{ "is_unsubscribed" : false }, 
					{ "is_active" : true }
				]  
			};

			var actualText = generator.generateCriteria(criteria);

	
			var expectedText = "email = 'adfasd@asdcasdc.com' and ( is_unsubscribed = false or is_active = true )";	
			actualText.should.equal(expectedText);

			done();
		});		


		it("when a compound criteria, with not operator tests,, is passed to generateCriteria", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var criteria = 
			{ 
				"or" : 
				[ 
					{ "is_unsubscribed" : false }, 
					{ ne : { "is_active" : false  }}
				]  
			};

			var actualText = generator.generateCriteria(criteria);

	
			var expectedText = "( is_unsubscribed = false or is_active <> false )";	
			actualText.should.equal(expectedText);

			done();
		});	



		it("when a compound  criteria is passed to generateCriteria", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var criteria = 
			{ 
				email : "test@asdf.com", 				
				"or" : 
				[ 
					{ "is_unsubscribed" : false }, 
					{ "is_active" : true }
				]  
			};

			var actualText = generator.generateCriteria(criteria);

			var expectedText = "email = 'test@asdf.com' and ( is_unsubscribed = false or is_active = true )";	
			actualText.should.equal(expectedText);

			done();
		});


		it("when a compound criteria, with different operators is passed, is passed to generateCriteria", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var criteria = 
			{ 
				email : "test@asdf.com", 				
				"or" : 
				[ 
					{ "is_unsubscribed" : false }, 
					{ lte : { "number_password_failed_attempts" : 5 } }
				]  
			};

			var actualText = generator.generateCriteria(criteria);

			var expectedText = "email = 'test@asdf.com' and ( is_unsubscribed = false or number_password_failed_attempts <= 5 )";	
			actualText.should.equal(expectedText);

			done();
		});

		it("when a compound criteria, with lots of nesting, is passed to generateCriteria", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var criteria = 
			{ 
				email : "test@asdf.com", 				
				"or" : 
				[ 
					{ "is_unsubscribed" : false, is_active: true }, 
					{ lte : { "number_password_failed_attempts" : 5 } }
				]  
			};

			var actualText = generator.generateCriteria(criteria);

			var expectedText = "email = 'test@asdf.com' and ( (is_unsubscribed = false and is_active = true) or number_password_failed_attempts <= 5 )";	
			actualText.should.equal(expectedText);

			done();
		});


		it("when a compound criteria, with a empty or set, is passed to generateCriteria", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var criteria = 
			{ 
				email : "test@asdf.com", 				
				"or" : 
				[ 
				]  
			};

			var actualText = generator.generateCriteria(criteria);
			var expectedText = "email = 'test@asdf.com'";	

			actualText.should.equal(expectedText);

			done();
		});


		it("when an 'in' criteria is passed to generateCriteria", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var criteria = 
			{ 
				number_password_failed_attempts : 
				{ 				
					"in" : 
					[
						1,
						2 
					]
				} 
			};

			var actualText = generator.generateCriteria(criteria);

			var expectedText = "in ( 1,2 )";	
			actualText.should.equal(expectedText);

			done();
		});

		it("when an empty 'in' criteria is passed to generateCriteria", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var criteria = 
			{ 
				number_password_failed_attempts : 
				{ 				
					"in" : 
					[
					]
				} 
			};

			var actualText = generator.generateCriteria(criteria);

			var expectedText = "in (  )";	
			actualText.should.equal(expectedText);

			done();
		});


		it("when an a string based 'in' criteria is passed to generateCriteria", function(done)
		{
			var generator = new queryGenerator();
			generator.model = userTest;

			var criteria = 
			{ 
				emails : 
				{ 				
					"in" : 
					[
						"ry'an@ryan.com",
						"lauren@lauren.com"
					]
				} 
			};

			var actualText = generator.generateCriteria(criteria);

			var expectedText = "in ( ''ry\\'an@ryan.com'',''lauren@lauren.com'' )";	
			actualText.should.equal(expectedText);

			done();
		});

	});	

});


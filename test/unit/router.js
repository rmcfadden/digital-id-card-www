var should = require("should");
var router = require("../../lib/router.js");

var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();


describe("router", function()
{
	it("object", function(done)
	{
		var currentRouter = new router();
		should.notEqual(currentRouter, null);
		done();
	});


	it("when a null arg is supplied to getRouteInfos", function(done)
	{
		var currentRouter = new router();

		should.throws( function() { currentRouter.getRouteInfos(null); }, Error);
		done();
	});


	it("when getRouteInfos is given some routes with the name property missing", function(done)
	{

		var routes = [{ "name1" : "user" }];

		var currentRouter = new router();

		should.throws( function() { currentRouter.getRouteInfos(routes); }, Error);
		done();
	});


	it("when getRouteInfos is given some routes where the method.name and method.method is empty ", function(done)
	{

		var routes = [{ "name"  : "user", methods: [{ "name1" : "user" }] }];

		var currentRouter = new router();

		should.throws( function() { currentRouter.getRouteInfos(routes); }, Error);
		done();

	});


	it("when getRouteInfos is given some valid routes", function(done)
	{

		var routes = require("./routes.json").routes;

		var currentRouter = new router();
		var routeInfos = currentRouter.getRouteInfos(routes);

		var usersController = require("../../controllers/users_controller.js");

		var standardController = require("../../lib/standard_controller.js");


		routeInfos[0].method.should.equal("get");
		routeInfos[0].name.should.equal("users/me");
		routeInfos[0].function.should.equal(usersController.me);

		routeInfos[1].method.should.equal("post");
		routeInfos[1].name.should.equal("users");
		routeInfos[1].function.should.equal(usersController.create);
			
		routeInfos[2].method.should.equal("put");
		routeInfos[2].name.should.equal("users");
		routeInfos[2].function.should.equal(usersController.update);

		routeInfos[3].method.should.equal("post");
		routeInfos[3].name.should.equal("users/login");
		routeInfos[3].function.should.equal(usersController.login);

		routeInfos[4].method.should.equal("post");
		routeInfos[4].name.should.equal("users/logout");
		routeInfos[4].function.should.equal(usersController.logout);

		routeInfos[5].method.should.equal("get");
		routeInfos[5].name.should.equal("roles");
		routeInfos[5].function.should.equal(standardController.findAll);

		routeInfos[6].method.should.equal("get");
		routeInfos[6].name.should.equal("roles/:id");
		routeInfos[6].function.should.equal(standardController.findById);

		should.equal(routeInfos[10].function, null);


	
		done();
	});

});



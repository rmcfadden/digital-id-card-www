var should = require("should");
var random = require("../../lib/random");

var testUtils = require("../../lib/test_utils.js");

var repositoryFactory = require("../../lib/repository_factory.js");
var factory = new repositoryFactory();

var userKeysProvider = require("../../lib/providers/user_keys_provider.js");
var userKeysProv = new userKeysProvider();


var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();



describe("userKeysProvider", function()
{
	it("object", function(done)
	{
		should.notEqual(userKeysProv, null);
		done();
	});


	it("generateKeyPair", function(done)
	{	
		userKeysProv.generateKeyPair(1024, function(error, result)
		{
			result.private.shouldStartWith("-----BEGIN RSA PRIVATE KEY-----");
			result.private.shouldEndWith("-----END RSA PRIVATE KEY-----\n");

			result.public.shouldStartWith("-----BEGIN PUBLIC KEY-----");
			result.public.shouldEndWith("-----END PUBLIC KEY-----\n");

			done();
		});
	});





});

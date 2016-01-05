var should = require("should");
var sessionsProvider = require("../../lib/providers/sessions_provider");
var moment = require("moment");

var dateTime = require("../../lib/date_time");


var config = require("../../config");

var testUtils = require("../../lib/test_utils.js");

var testUtil = new testUtils(); 
testUtil.setupTestEnvironment();

var sessionsProv = new sessionsProvider();


describe("sessionsProvider", function()
{
	it("object", function(done)
	{
		should.notEqual(sessionsProv, null);
		done();
	});


	it("when passing null to createAccessToken ", function(done)
	{
		should.throws( function() { sessionsProv.createAccessToken(null) }, Error);
		done();
	});


	it("when passing argument without uuid to createAccessToken ", function(done)
	{
		should.throws( function() { sessionsProv.createAccessToken({user_id: 1231}) }, Error);
		done();
	});


	it("when passing argument without user_id to createAccessToken ", function(done)
	{
		should.throws( function() { sessionsProv.createAccessToken({uuid: "000011000-0000-0000-0000-000000000000"}) }, Error);
		done();
	});


	it("when passing a valid argument to createAccessToken ", function(done)
	{
		var accessToken =  sessionsProv.createAccessToken({uuid: "000011000-0000-0000-0000-000000000000", user_id : 123123 });
		accessToken.should.equal("b6db272ad5d8618fcc7827e8d751abe133fb3c67f5d734cf1ee6c5a7515b5dd6613ecc54068c03eac19f00b3db731b40");
	
		done();
	});


	it("when passing null to extractAccessTockenInfo", function(done)
	{
		should.throws( function() { sessionsProv.extractAccessTockenInfo(null) }, Error);
		done();
	});


	it("when passing a valid token to extractAccessTockenInfo", function(done)
	{
		var uuid = "000011000-0000-0000-0000-000000000011";
		var user_id = 1231231;

		var accessToken =  sessionsProv.createAccessToken({uuid: uuid, user_id : user_id });

		var sessionInfo = sessionsProv.extractAccessTockenInfo(accessToken);
		sessionInfo.uuid.should.be.equal("000011000-0000-0000-0000-000000000011");
		sessionInfo.user_id .should.be.equal(1231231);

		done();
	});


	it("when passing a valid token to extractAccessTockenInfo", function(done)
	{
		var sessionInfo = sessionsProv.extractAccessTockenInfo("asdfasdfs");
		should.equal(sessionInfo, null);

		done();
	});


	it("when passing null to verifyIsSessionExpired ", function(done)
	{
		should.throws( function() { sessionsProv.verifyIsSessionExpired(null) }, Error);
		done();
	});


	it("when passing null to verifyIsSessionExpired ", function(done)
	{
		sessionsProv.verifyIsSessionExpired({"is_expired": true}).should.equal(true);
		done();
	});


	it("when passing is_expire true to verifyIsSessionExpired ", function(done)
	{
		sessionsProv.verifyIsSessionExpired({"is_expired": true}).should.equal(true);
		done();
	});


	it("when passing expired end_time to verifyIsSessionExpired", function(done)
	{
		var utcNow = new dateTime.utcNow();
		var currentTimePlusOneMinute = moment(utcNow).add("minutes", 1).utc();
		


		sessionsProv.verifyIsSessionExpired({"is_expired": false, "end_time": currentTimePlusOneMinute.format() }).should.equal(false);
		done();
	});


	it("when passing a non expired end_time to verifyIsSessionExpired", function(done)
	{
		var utcNow = new dateTime.utcNow();
		var currentTimeMinusOneMinute = moment(utcNow).subtract("minutes", 1).utc();
		sessionsProv.verifyIsSessionExpired({"is_expired": false, "end_time": currentTimeMinusOneMinute.format() }).should.equal(true);
		done();
	});


});


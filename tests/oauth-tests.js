var OAuth = require('../lib/oauth'),
  nock = require("nock");

module.exports = {

  setUp: function(callback) {

    callback();
  },

  tearDown: function(callback) {
    // clean up
    callback();
  },

  "Should allow creation of oauth module": function(test) {
    
    var scope = nock('http://aurl.com')
      .post('/getToken', "client_id=appId&client_secret=appSecret&grant_type=client_credentials")
      .reply(200, {
        "access_token" :"atoken12345"
      });

    var oauth = new OAuth("http://aurl.com/getToken");

    oauth.getAppToken("appId", "appSecret", function(error, token) {
      test.equal(scope.isDone(), true, "must have met all mocked requests");
      test.equal(token.access_token, "atoken12345");
      test.equal(error, null, "should not error");
      test.done();
    });

  }
}
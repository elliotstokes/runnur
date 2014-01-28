var OAuth = require('../lib/oauth');

module.exports = {

  setUp: function(callback) {

    callback();
  },

  tearDown: function(callback) {
    // clean up
    callback();
  },

  "Should  allow creation of oauth module": function(test) {

    var oauth = new OAuth("https://aurl/getToken");
    test.done();
  }
}
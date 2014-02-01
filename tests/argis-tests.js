var arcgis = require('../lib/arcgis');

module.exports = {

  setUp: function(callback) {

    callback();
  },

  tearDown: function(callback) {
    // clean up
    callback();
  },

  "Should allow proxying of requests to route service": function(test) {
    test.done();
  },

  "Should allow proxying of requests to service area service": function(test) {
    test.done();
  }
}
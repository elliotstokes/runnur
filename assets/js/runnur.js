(function() {

  this.map = null;

  /**
   * fires when the map is clicked.
   */
  this.mapClicked = function(clickEventArgs) {

    var _this = this;

    require(["app/Router", "dojo/request"], function(Router, request) {

      request.get('./gettoken', {'handleAs' : 'json'}).then(function(tokenData) {

        var router = new Router({
          map: _this.map,
          token: tokenData.token
        });


        router.route(clickEventArgs.mapPoint);

      })

    });

  }

  /**
   * Initialize everything
   */
  this.init = function() {

    var _this = this;

    require([
      "dojo/request",
      "esri/arcgis/utils",
      "esri/dijit/Geocoder",
      "dojo/_base/lang",
      "dojo/request",
      "dojo/domReady!"
    ], function(request, arcgisUtils, Geocoder, lang, request) {

      request.get('./config', {'handleAs' : 'json'}).then(function(config) {

        arcgisUtils.createMap(config.webmapId, "map").then(function(response) {

          //create Geocoder
          new Geocoder({
            map: response.map,
            autoNavigate: true,
            maxLocations: 20,
            value: "Banbury"
          }, "search");

          //hook into map click to start everything
          response.map.on("click", lang.hitch(_this, "mapClicked"));

          //set global map prop to use later on.
          _this.map = response.map;

        });

      })

    });

  };


  //call init
  this.init();


})();
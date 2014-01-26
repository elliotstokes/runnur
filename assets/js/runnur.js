(function() {

  this.map = null;

  /**
   * fires when the map is clicked.
   */
  this.mapClicked = function(clickEventArgs) {

    var _this = this;

    require(["app/Router"], function(Router) {

      var router = new Router({
        map: _this.map
      });


      router.route(clickEventArgs.mapPoint);
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
      "dojo/domReady!"
    ], function(request, arcgisUtils, Geocoder, lang) {

      arcgisUtils.createMap("92309d85b34342de8514caefa3df56a5", "map").then(function(response) {

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
    });

  };


  //call init
  this.init();


})();
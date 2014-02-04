(function() {

  require([
    "knockout",
    "app/ViewModel",
    "dojo/request",
    "esri/arcgis/utils",
    "esri/dijit/Geocoder",
    "dojo/_base/lang",
    "dojo/request",
    "dojo/parser",
    "esri/toolbars/draw",
    "dojo/domReady!"
  ], function(
    ko,
    ViewModel,
    request,
    arcgisUtils,
    Geocoder,
    lang,
    request,
    parser,
    Draw) {

    parser.parse();

    this.map = null;

    this.drawBar = null;

    var _this = this;

    /**
     * fires when the map is clicked.
     */
    this.mapClicked = function(clickEventArgs) {

      var _this = this,
        startPoint = clickEventArgs.mapPoint;

      require([
        "app/Router",
        "dojo/request",
        "esri/geometry/Point",
        "esri/SpatialReference"
      ], function(Router, request, Point, SpatialReference) {


        var router = new Router({
          map: _this.map
        });

        var routeType = _this.model.routeType();
        if (routeType === "circular") {
          router.circularRoute(startPoint, _this.model.routeLength());
        } else if (routeType === "linear") {
          router.linearRoute(startPoint, _this.model.routeLength());
        } else {
          alert("Route type not supported");
        }
        //

      });

    }

    /**
     * Initialize everything
     */
    this.init = function() {

      var _this = this;


      this.model = new ViewModel();



      ko.applyBindings(this.model);

      request.get('./config', {
        'handleAs': 'json'
      }).then(function(config) {

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

          //create draw toolbar and attach to map
          _this.drawBar = new Draw(response.map);

          //set global map prop to use later on.
          _this.map = response.map;

        });

      });

    };


    //call init
    this.init();

    //setup drag and drop.
    function handleFileSelect(evt) {
      evt.stopPropagation();
      evt.preventDefault();

      var files = evt.dataTransfer.files; // FileList object.

      // files is a FileList of File objects. List some properties.
      var output = [];
      for (var i = 0, f; f = files[i]; i++) {
        alert(f.name);
      }
    }

    function handleDragOver(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    // Setup the dnd listeners.
    var dropZone = document.getElementById('drop-zone');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);

    

    function drawButtonClick(evt) {
      alert("draw a route.")
      //_this.drawBar.activate('polyline');
    }
    //setup click events
    var drawButton = document.getElementById('draw-button');
    drawButton.addEventListener('click', drawButtonClick, false);


  });

})();
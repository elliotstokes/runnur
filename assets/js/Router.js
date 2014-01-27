define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"esri/symbols/PictureMarkerSymbol",
	"esri/graphic",
	"esri/tasks/RouteTask",
	"esri/tasks/RouteParameters"

], function(declare, lang, PictureMarkerSymbol, Graphic, RouteTask, RouteParameters) {

	var defaultOptions = {
		fromIcon: "assets/images/icon.png",
		toIcon: "assets/images/icon.png",
		token: null,
		map: null
	};

	return declare(null, {

		constructor: function(options) {

			var _route = function() {
				var routeTask = new RouteTask("http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World");
				var routeParams = new RouteParameters();
				routeTask.solve();
			};

			var _serviceArea = function() {

			};

			//build the options.
			this.options = lang.mixin(defaultOptions, options);

			this.route = function(from, to) {
				var symbol = new PictureMarkerSymbol(this.options.fromIcon, 40, 55),
					fromGraphic = new Graphic(from, symbol);

				//put icon at the bottom of the point
				symbol.setOffset(0, 27);

				//add graphic
				this.options.map.graphics.add(fromGraphic);

				
				//
				//route to point
				//new Point(445000, 240000)


			}

			this.circularRoute = function(from, distance) {

			}
		}
	});
});
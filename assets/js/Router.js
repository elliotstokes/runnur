define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"esri/symbols/PictureMarkerSymbol",
	"esri/symbols/SimpleLineSymbol",
	"esri/graphic",
	"esri/tasks/RouteTask",
	"esri/tasks/RouteParameters",
	"dojo/Deferred"

], function(declare, lang, PictureMarkerSymbol, SimpleLineSymbol, Graphic, RouteTask, RouteParameters, Deferred) {

	var defaultOptions = {
		fromIcon: "assets/images/icon.png",
		toIcon: "assets/images/icon.png",
		map: null
	};

	return declare(null, {

		constructor: function(options) {

			var _route = function(from, to) {

				//init route task
				var routeTask = new RouteTask("./route")
				result = new Deferred();

				//createparams
				var routeParams = new RouteParameters();
				routeParams = new esri.tasks.RouteParameters();
				routeParams.stops = new esri.tasks.FeatureSet();
				routeParams.stops.features[0] = from;
				routeParams.stops.features[1] = to;
				routeParams.returnRoutes = true;
				routeParams.returnDirections = true;
				routeParams.directionsLengthUnits = esri.Units.MILES;
				routeParams.outSpatialReference = options.map.spatialReference;

				//solve
				
				routeTask.on('solve-complete', function(solveResult) { 
					result.resolve(solveResult);
				});

				routeTask.on('error', function(error) {
					result.reject(error);
				});

				routeTask.solve(routeParams);

				return result.promise;
			};

			var _serviceArea = function() {

			};

			//build the options.
			this.options = lang.mixin(defaultOptions, options);

			this.route = function(from, to) {
				var fromSymbol = new PictureMarkerSymbol(this.options.fromIcon, 40, 55),
					fromGraphic = new Graphic(from, fromSymbol),
					toGraphic = new Graphic(to, fromSymbol),
					_this = this;

				//put icon at the bottom of the point
				fromSymbol.setOffset(0, 27);

				//add graphic
				this.options.map.graphics.add(fromGraphic);
				this.options.map.graphics.add(toGraphic);

				_route(fromGraphic, toGraphic).then(function(route) {
					console.log(route);
					var theRoute = route.result.routeResults[0].route;
					_this.options.map.setExtent(theRoute.geometry.getExtent());
					theRoute.setSymbol(new SimpleLineSymbol());
					_this.options.map.graphics.add(theRoute);
				});
				//
				//route to point


			}

			this.circularRoute = function(from, distance) {

			}
		}
	});
});
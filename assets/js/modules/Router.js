define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"esri/symbols/PictureMarkerSymbol",
	"esri/symbols/SimpleLineSymbol",
	"esri/symbols/SimpleFillSymbol",
	"esri/graphic",
	"esri/tasks/RouteTask",
	"esri/tasks/RouteParameters",
	"esri/tasks/ServiceAreaTask",
	"esri/tasks/ServiceAreaParameters",
	"esri/tasks/FeatureSet",
	"esri/geometry/Point",
	"dojo/_base/Color",
	"dojo/Deferred",
	"dojo/query"

], function(
	declare,
	lang,
	PictureMarkerSymbol,
	SimpleLineSymbol,
	SimpleFillSymbol,
	Graphic,
	RouteTask,
	RouteParameters,
	ServiceAreaTask,
	ServiceAreaParameters,
	FeatureSet,
	Point,
	Color,
	Deferred,
	query) {

	var defaultOptions = {
		fromIcon: "assets/images/icon.png",
		toIcon: "assets/images/icon.png",
		map: null
	};

	return declare(null, {

		constructor: function(options) {


			//build the options. Take defualts and merge with input options
			this.options = lang.mixin(defaultOptions, options);

			/**
			 * internal routing method
			 **/
			var _route = function(from, to, via) {

				//init route task
				var routeTask = new RouteTask("./route"),
					result = new Deferred();

				//createparams
				var routeParams = new RouteParameters();
				routeParams = new RouteParameters();
				routeParams.stops = new FeatureSet();
				routeParams.stops.features.push(from);
				if (via && via.length > 0) {
					for (var i = 0, il = via.length; i < il; i++) {
						routeParams.stops.features.push(via[i]);
					}
				}
				//add last stop
				routeParams.stops.features.push(to);
				routeParams.returnRoutes = true;
				routeParams.returnDirections = true;
				routeParams.restrictionAttributes = ["Walking"];
				routeParams.restrictUTurns = "esriNFSBNoBacktrack";
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

			/**
			 * internal service area method
			 **/
			var _serviceArea = function(from, distance) {

				var serviceAreaTask = new ServiceAreaTask("./servicearea"),
					serviceTaskParams = new ServiceAreaParameters(),
					result = new Deferred();

				serviceTaskParams.defaultBreaks = [distance];
				serviceAreaTask.impedanceAttribute = "Miles";
				serviceTaskParams.outSpatialReference = map.spatialReference;
				serviceTaskParams.facilities = new FeatureSet();
				serviceTaskParams.facilities.features[0] = from;
				serviceTaskParams.returnFacilities = true;

				serviceAreaTask.on('solve-complete', function(solveResult) {
					result.resolve(solveResult);
				});

				serviceAreaTask.on('error', function(error) {
					result.reject(error);
				});

				serviceAreaTask.solve(serviceTaskParams);

				return result.promise;
			};

			/**
			 * Creates a linear route.
			 * @param {Point} Point to route from
			 **/
			this.linearRoute = function(from, distance) {
				var fromSymbol = new PictureMarkerSymbol(this.options.fromIcon, 40, 55),
					fromGraphic = new Graphic(from, fromSymbol),
					_this = this;

				console.log("linear @ " + distance);
				//clear map
				this.options.map.graphics.clear();

				this.options.map.graphics.add(fromGraphic);

				_serviceArea(fromGraphic, distance).then(
					function(result) {
						var theArea = result.result.serviceAreaPolygons[0];
						_this.options.map.setExtent(theArea.geometry.getExtent());
						theArea.setSymbol(new SimpleFillSymbol());
						_this.options.map.graphics.add(theArea);

						//Now randomly choose a ring
						var ring = theArea.geometry.rings[Math.round(Math.random() * (theArea.geometry.rings.length - 1))];

						//now randomly choose a point from that ring
						var point = ring[Math.round(Math.random() * (ring.length - 1))];

						//create a graphic for the end
						var toGraphic = new Graphic(new Point(point[0], point[1], _this.options.map.spatialReference), fromSymbol);
						//now route to that point
						_this.options.map.graphics.add(toGraphic);


						_route(fromGraphic, toGraphic).then(
							function(route) {
								var theRoute = route.result.routeResults[0].route;
								_this.options.map.setExtent(theRoute.geometry.getExtent());
								theRoute.setSymbol(new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color("red"), 3));
								_this.options.map.graphics.add(theRoute);

								_this.displayDirections(query("#directions").style({
									"display": "block"
								}), route.result.routeResults[0].directions);
							}
						);
					},
					function(error) {
						console.log(error);
						alert("bust");
					}
				);
			}

			/**
			 * Creates a circular route.
			 * @param {Point} Point to route from
			 **/
			this.circularRoute = function(from, distance) {
				var fromSymbol = new PictureMarkerSymbol(this.options.fromIcon, 40, 55),
					fromGraphic = new Graphic(from, fromSymbol),
					_this = this;

				console.log("circular @ " + distance);
				
				//clear map
				this.options.map.graphics.clear();

				this.options.map.graphics.add(fromGraphic);

				_serviceArea(fromGraphic, Math.floor(distance / 2)).then(
					function(result) {
						var theArea = result.result.serviceAreaPolygons[0];
						_this.options.map.setExtent(theArea.geometry.getExtent());
						theArea.setSymbol(new SimpleFillSymbol());
						_this.options.map.graphics.add(theArea);

						//Now randomly choose a ring
						var ring = theArea.geometry.rings[Math.round(Math.random() * (theArea.geometry.rings.length - 1))];

						//now randomly choose a point from that ring
						var point = ring[Math.round(Math.random() * (ring.length - 1))];

						//create a graphic for the end
						var toGraphic = new Graphic(new Point(point[0], point[1], _this.options.map.spatialReference), fromSymbol);
						//now route to that point
						_this.options.map.graphics.add(toGraphic);


						_route(fromGraphic, fromGraphic, [toGraphic]).then(function(route) {
							var theRoute = route.result.routeResults[0].route;
							_this.options.map.setExtent(theRoute.geometry.getExtent());
							theRoute.setSymbol(new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color("red"), 3));
							_this.options.map.graphics.add(theRoute);
							console.log()
							//rm for testing only
							console.log(route.result);
							_this.displayDirections(query("#directions").style({
								"display": "block"
							}), route.result.routeResults[0].directions);
						});
					},
					function(error) {
						console.log(error);
						alert("bust");
					}
				);
			}

			this.displayDirections = function(parent, features) {

			}
		}
	});
});
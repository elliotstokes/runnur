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
	"dojo/_base/Color"
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

			var _route = function(from, to, via) {

				//init route task
				var routeTask = new RouteTask("./route"),
					result = new Deferred();

				//createparams
				var routeParams = new RouteParameters();
				routeParams = new RouteParameters();
				routeParams.stops = new FeatureSet();
				routeParams.stops.features.push(from);
				if (via && via.length>0) {
					for (var i=0,il=via.length; i<il;i++) {
						routeParams.stops.features.push(via[i]);
					}
				}
				//add last stop
				routeParams.stops.features.push(to);
				routeParams.returnRoutes = true;
				routeParams.returnDirections = true;
				routeParams.restrictionAttributes = ["Walking"];
				routeParams.restrictUTurns =  "esriNFSBAtDeadEndsOnly";
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

			var _serviceArea = function(from) {

				var serviceAreaTask = new ServiceAreaTask("./servicearea"),
					serviceTaskParams = new ServiceAreaParameters(),
					result = new Deferred();

				serviceTaskParams.defaultBreaks = [10];
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


			}

			this.circularRoute = function(from, distance) {
				var fromSymbol = new PictureMarkerSymbol(this.options.fromIcon, 40, 55),
					fromGraphic = new Graphic(from, fromSymbol),
					_this = this;

				this.options.map.graphics.add(fromGraphic);

				_serviceArea(fromGraphic).then(function(result) {
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
							theRoute.setSymbol(new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color("red"),3));
							_this.options.map.graphics.add(theRoute);

							console.log(route);
							//rm for testing only
							_this.displayDirections(query("#directions").style({"display":"block"}), route.reslt.routeResults[0].directions);
						});
					},
					function(error) {
						console.log(error);
						alert("bust");
					});
			}

			this.displayDirections = function(parent, features) {
				//todo
			}
		}
	});
});
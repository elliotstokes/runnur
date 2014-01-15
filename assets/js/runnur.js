  require([
  	"esri/arcgis/utils",
  	"esri/dijit/Geocoder",
  	"dojo/domReady!"
  ], function(arcgisUtils, Geocoder) {
  	arcgisUtils.createMap("92309d85b34342de8514caefa3df56a5", "map").then(function(response) {
  		//todo: add stuff
  		new Geocoder({
  			map: response.map,
  			autoNavigate: true,
  			maxLocations: 20,
  			value: "Portland, OR coffee shops"
  		}, "search");
  	});
  });
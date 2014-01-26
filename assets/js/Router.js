define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"esri/symbols/PictureMarkerSymbol",
	"esri/graphic"

], function(declare, lang, PictureMarkerSymbol, Graphic) {

	var defaultOptions = {
		fromIcon: "assets/images/icon.png",
		toIcon: "assets/images/icon.png",
		token: null,
		map: null
	};

	return declare(null, {

		constructor: function(options) {
			//build the options.
			this.options = lang.mixin(defaultOptions, options);

			this.route = function(from, to) {
				var symbol = new PictureMarkerSymbol(this.options.fromIcon, 40, 55),
					fromGraphic = new Graphic(from, symbol);

				//put icon at the bottom of the point
				symbol.setOffset(0, 27);

				//add graphic
				this.options.map.graphics.add(fromGraphic);

			}

			this.circularRoute = function(from, distance) {

			}
		}
	});
});
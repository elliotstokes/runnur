var express = require('express'),
	app = express(),
	arcgis = require("./lib/arcgis"),
	config = require("./application-config.json");

//Set views directory
app.set('views', __dirname + '/views');

app.use(express.bodyParser());

/**
 * Main application Route.
 */
app.get("/", function(req, res) {
	res.render("index.jade");
});

/**
 * Get app config
 */
app.get("/config", function(req, res) {
	res.json(config.client);
});



app.get("/route/*", function(req, res, next) {
	arcgis.route(req.query, res);
});

/**
 * get a token to use routing
 */
app.post("/route/*", function(req, res, next) {
	arcgis.route(req.body, res);
});

app.get("/servicearea/*", function(req, res, next) {
	arcgis.serviceArea(req.query, res);
});

//setup static route
app.use('/assets', express.static(__dirname + '/assets'));

app.listen(process.env.PORT || 1337);

console.log("Runnur is running!");
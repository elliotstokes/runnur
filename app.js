var express = require('express'),
	app = express(),
	config = require("./application-config.json");

//Set views directory
app.set('views', __dirname + '/views');


/**
* Main application Route.
*/
app.get("/", function(req,res) {
	res.render("index.jade");
});

/**
* Get app config
*/
app.get("/config", function(req,res) {
	res.json(config.client);
});

/**
* get a token to use routing
*/
app.get("/gettoken", function(req, res) {
	//take oauth app token and secret and exchange for a token
});

//setup static route
app.use('/assets', express.static(__dirname + '/assets'));

app.listen(1337);
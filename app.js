var express = require('express'),
	app = express(),
	OAuth = require('./lib/oauth'),
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
* TODO Remove and add into config
*/
app.get("/gettoken", function(req, res, next) {
	var result = {
		token: null,
		expiration: -1
	}, oAuth = new OAuth("https://www.arcgis.com/sharing/oauth2/token");

	oAuth.getAppToken(config.server.applicationId, config.server.applicationSecret, function(error, tokenResult) {
		
		if (error) {
			next(error);
			return;
		}

		result.token = tokenResult.access_token;
		result.expiration = (new Date().getTime() * 10000) + (tokenResult.expires_in * 60000)

		res.json(result);

	});

	
});

//setup static route
app.use('/assets', express.static(__dirname + '/assets'));

app.listen(1337);

console.log("Runnur is running!");
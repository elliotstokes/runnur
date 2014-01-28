var express = require('express'),
	app = express(),
	OAuth = require('./lib/oauth'),
	config = require("./application-config.json"),
	http = require('http'),
	querystring = require('querystring');

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


/**
TODO Refactor all this.
*/
var _route = function(data, userRes) {
	var oAuth = new OAuth("https://www.arcgis.com/sharing/oauth2/token");

	oAuth.getAppToken(process.env.appId, process.env.appSecret, function(error, tokenResult) {

		if (error) {
			console.log(error);
			return;
		}

		data.token= tokenResult.access_token;

		var postdata = querystring.stringify(data);
		// An object of options to indicate where to post to
		var options = {
			host: 'route.arcgis.com',
			port: '80',
			path: '/arcgis/rest/services/World/Route/NAServer/Route_World/solve',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': postdata.length
			}
		};

		// Set up the request
		var post_req = http.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				userRes.write(chunk);
			});

			res.on('end', function() {
				userRes.end();
			})
		});

		post_req.on('error', function(error) {
			console.log('error');
		});

		// post the data
		post_req.write(postdata);
		post_req.end();
	});
}

app.get("/route/*", function(req, res, next) {
	_route(req.query, res);
});

/**
 * get a token to use routing
 */
app.post("/route/*", function(req, res, next) {
	
	_route(req.body, res);
});

//setup static route
app.use('/assets', express.static(__dirname + '/assets'));

app.listen(process.env.PORT || 1337);

console.log("Runnur is running!");
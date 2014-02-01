var http = require('http'),
	querystring = require('querystring'),
	OAuth = require('./oauth');


/**
* call route method based on data passed in and the proxy to express response
*/
exports.route = function(data, userRes) {
	var oAuth = new OAuth("https://www.arcgis.com/sharing/oauth2/token");

	oAuth.getAppToken(process.env.appId, process.env.appSecret, function(error, tokenResult) {

		if (error) {
			console.log(error);
			return;
		}

		data.token = tokenResult.access_token;

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
};


exports.serviceArea = function(data, userRes) {
	var oAuth = new OAuth("https://www.arcgis.com/sharing/oauth2/token");

	oAuth.getAppToken(process.env.appId, process.env.appSecret, function(error, tokenResult) {

		if (error) {
			console.log(error);
			return;
		}

		data.token = tokenResult.access_token;
		console.log(data.token);
		var postdata = querystring.stringify(data);
		// An object of options to indicate where to post to
		var options = {
			host: 'route.arcgis.com',
			port: '80',
			path: '/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_Europe/solveServiceArea',
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
};
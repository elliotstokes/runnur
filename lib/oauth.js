var restler = require('restler');

function OAuth(url) {

	this.url = url;

	/**
	 * exchange app details for a token
	 */
	this.getAppToken = function(applicationKey, applicationSecret, callback) {
		//TODO repackage result instead of returning ws result + val.
		restler.post(this.url, {
			data: {
				client_id : applicationKey,
				client_secret : applicationSecret,
				grant_type :'client_credentials'
			},
			parser : restler.parsers.json
		})
			.on('success', function(data) {
				callback(null, data);
				return;
			})

			.on('error', function(error) {
				callback(error, null);
				return;
			});

	}

}

module.exports = OAuth;
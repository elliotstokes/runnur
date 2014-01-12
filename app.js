var express = require('express'),
	app = express();

/**
* Main application Route.
*/
app.get("/", function(req,res) {
	res.send("runnur");
	res.end();
});

app.listen(1337);
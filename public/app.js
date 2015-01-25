// app.js

// BASE SETUP
// ==============================================

var express  = require('express'),
	app      = express(),
	routes   = require('./routes'),
	port     = process.env.PORT || 5000;

// ROUTES
// ==============================================

app.use('/', routes.index);

// START THE SERVER
// ==============================================

app.listen(port, function() {
	console.log('Just Canvas on port ' + port);
});


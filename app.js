var express  = require('express'),
	app      = express(),
	port     = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));

app.use('/', function(req, res){
	res.sendfile('public/index.html');
});

app.listen(port, function() {
	console.log('Just Canvas on port ' + port);
});

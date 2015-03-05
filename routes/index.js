/*
 * Routes index.
 */

exports.index = function(req, res){
	res.sendfile('public/index.html');
};

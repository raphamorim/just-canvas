/*
 * Routes index.
 */

exports.index = function(req, res){
	res.send(404, {name: 'NotFound', message: 'Resource was not found'});
};

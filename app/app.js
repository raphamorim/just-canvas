window.requestAnimFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
})();

var getRand = function(type) {
	if (type === 'size')
		return (Math.floor(Math.random() * 8) * 10)

	if (type === 'color')
		return Math.floor(Math.random() * colors.length)

	if (type === 'pos')
		return [
			(Math.floor(Math.random() * 200) * 10),
			(Math.floor(Math.random() * 80) * 10)
		]

	return false
};

function start(ctx) {
        ctx.font="20px Georgia";
        ctx.fillText("Just Canvas. A dance with canvas experiment", 50, 50);
}

window.onload = function() {
	var colors = ['#f0fd36', '#f49ff1', '#f53eac', '#76fbfa'],
	    speed = 35;

	var body = document.querySelector('body'),
	    canvas = document.getElementById('dance'),
	    ctx = canvas.getContext('2d');

        // Applying some style on elements
	body.style.background = '#2C2C44';
	body.style.margin = '0px';
	canvas.style.margin = '0px';
	canvas.style.padding = '0px';

        // Applying size dimensions in canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	start(ctx);
	//draw = setInterval(update, speed);
}

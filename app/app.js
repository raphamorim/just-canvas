function start(ctx) {
        ctx.font="20px Georgia";
        ctx.fillText("Just Canvas. A dance with canvas experiment", 50, 50);
}

window.onload = function() {
	// Color Scheme and Animation/Events Speed
        var colors = ['#f0fd36', '#f49ff1', '#f53eac', '#76fbfa'],
	    speed = 35;

        // Define body, canvas (w/ Context)
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

        // Start Application
	start(ctx);
}

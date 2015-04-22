var stepActual = 0,
	posActual = 0,
	gamePoints = 0;

var Game = {
	init: function() {
		var canvas = document.getElementById('canvas'),
			context = canvas.getContext('2d'),
			btn = document.querySelector('.btn'),
			guide = document.querySelector('#guide'),
			message = document.querySelector('#message'),
			video;

		btn.addEventListener('click', function() {
			Utils.fadeOut(guide, function() {
				Utils.fadeIn(message, function() {
					message.style.display = 'block';
					
					var step = document.querySelector('.step');
						step.style.display = 'block';
					
					Run(canvas, context, message);
				});
			});
		});
	},

	stepsBuild: function(step) {
		if (!step) step = stepActual;

		var allSteps = document.querySelectorAll('.step>.pos'),
			nextStep = Math.floor((Math.random() * 4));

		if (nextStep === step) 
			return Game.stepsBuild(step);

		if (posActual === stepActual) {
			gamePoints += 100;			
		} else {
			gamePoints -= 100;
		}

		Game.scoreBuild(gamePoints);

		allSteps[stepActual].classList.remove('active');
		stepActual = nextStep;
		allSteps[stepActual].classList.add('active');
	},

	scoreBuild: function(points) {
		var score = document.querySelector('#score'),
			scoreValue = document.querySelector('#score .value');

		score.style.display = 'block';

		if (points >= 0) {
			scoreValue.style.color = 'lightgreen';
		} else {
			scoreValue.style.color = 'red';
		}

		scoreValue.innerHTML = points;
	},

	score: function(x, y) {
		if (x <= 200 && y <= 150) {
			posActual = 1;
		} else if (x <= 400 && y <= 150) {
			posActual = 0;
		} else if (x <= 200 && y >= 151) {
			posActual = 3;
		} else if (x <= 400 && y >= 151) {
			posActual = 2;
		}
	},

	calibrateCanvas: function(){
		// Here a simple guide how to use cam
		setTimeout(Game.start, 10000);
	},

	start: function() {
		Game.scoreBuild(gamePoints);
		document.querySelector('#steps').style.display = 'block';
		setInterval(Game.stepsBuild, 2600);
	}
};

function Run(canvas, context, message) {
	var smoother = new Smoother([0.9995, 0.9995], [0, 0], 0),
		video = document.createElement('video'),
		scene = document.querySelector('#scene'),
		body = document.querySelector('body'),
		detector;

	var fist_pos_old, angle = [0, 0];

	try {
		compatibility.getUserMedia({
			video: true
		}, function(stream) {
			try {
				Utils.fadeOut(message, function() {
					scene.style.visibility = 'visible';
					scene.width = window.innerWidth;
					scene.height = window.innerHeight;
					body.style.background = '#000';
					video.src = compatibility.URL.createObjectURL(stream);
					scene.play();

					Game.calibrateCanvas();
				});
			} catch (error) {
				Utils.fadeOut(message, function() {
					video.src = stream;
				});
			}
		}, function(error) {
			message.innerHTML = '<h2>Camera not <strong>available</strong>!</h2>';
		});
	} catch (error) {
		alert(error);
		message.innerHTML = '<h2>Ocurred a error!</h2>';
	}

	compatibility.requestAnimationFrame(play);

	function play() {
		compatibility.requestAnimationFrame(play);
		if (video.paused) video.play();

		canvas.width = ~~(300 * video.videoWidth / video.videoHeight);
		canvas.height = 300;

      	context.translate(canvas.clientWidth, 0);
      	context.scale(-1, 1);
		context.drawImage(video, 0, 0, canvas.clientWidth, canvas.clientHeight);

		if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {
			if (!detector) {
				var width = ~~(140 * video.videoWidth / video.videoHeight);
				var height = 140;
				detector = new objectdetect.detector(width, height, 1.1, objectdetect.handfist);
			}

			var coords = detector.detect(video, 1);
			if (coords[0]) {
				var coord = coords[0];

				coord[0] *= video.videoWidth / detector.canvas.width;
				coord[1] *= video.videoHeight / detector.canvas.height;
				coord[2] *= video.videoWidth / detector.canvas.width;
				coord[3] *= video.videoHeight / detector.canvas.height;

				var fist_pos = [coord[0] + coord[2] / 2, coord[1] + coord[3] / 2];

				if (fist_pos_old) {
					var dx = (fist_pos[0] - fist_pos_old[0]) / video.videoWidth,
						dy = (fist_pos[1] - fist_pos_old[1]) / video.videoHeight;

					if (dx * dx + dy * dy < 0.2) {
						angle[0] += 5.0 * dx;
						angle[1] += 5.0 * dy;
					}
					fist_pos_old = fist_pos;
				} else if (coord[4] > 2) {
					fist_pos_old = fist_pos;
				}

				context.beginPath();
				context.lineWidth = '2';
				context.fillStyle = fist_pos_old ? 'rgba(0, 255, 255, 0.3)' : 'rgba(255, 0, 0, 0.3)';
				context.fillRect(
					coord[0] / video.videoWidth * canvas.clientWidth,
					coord[1] / video.videoHeight * canvas.clientHeight,
					coord[2] / video.videoWidth * canvas.clientWidth,
					coord[3] / video.videoHeight * canvas.clientHeight);
				context.stroke();

				Game.score(coord[0] / video.videoWidth * canvas.clientWidth, coord[1] / video.videoHeight * canvas.clientHeight);

			} else fist_pos_old = null;
		}
	}
}

window.onload = Game.init;
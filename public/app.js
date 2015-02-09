window.onload = function() {
	var canvas = document.getElementById('canvas'),
		context = canvas.getContext('2d'),
		btn = document.querySelector('.btn'),
		guide = document.querySelector('#guide'),
		message = document.querySelector('#message'),
		video;

	btn.addEventListener('click', function() {
		fadeOut(guide, function() {
			message.style.display = 'block';
			fadeIn(message, function() {
				Run(canvas, context, message);
			});
		});
	});
};



function Run(canvas, context, message) {
	var smoother = new Smoother([0.9995, 0.9995], [0, 0], 0),
		video = document.createElement('video'),
		detector;

	var fist_pos_old, angle = [0, 0];

	try {
		compatibility.getUserMedia({
			video: true
		}, function(stream) {
			try {
				fadeOut(message, function() {
					video.src = compatibility.URL.createObjectURL(stream);
				});
			} catch (error) {
				fadeOut(message, function() {
					video.src = stream;
				});
			}
		}, function(error) {
			alert("WebRTC not available");
		});
	} catch (error) {
		alert(error);
	}

	compatibility.requestAnimationFrame(play);

	function play() {
		compatibility.requestAnimationFrame(play);
		if (video.paused) video.play();

		// Draw video overlay:
		canvas.width = ~~(300 * video.videoWidth / video.videoHeight);
		canvas.height = 300;
		context.drawImage(video, 0, 0, canvas.clientWidth, canvas.clientHeight);

		if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {

			// Prepare the detector once the video dimensions are known:
			if (!detector) {
				var width = ~~(140 * video.videoWidth / video.videoHeight);
				var height = 140;
				detector = new objectdetect.detector(width, height, 1.1, objectdetect.handfist);
			}

			// Do something

			// Perform the actual detection:
			var coords = detector.detect(video, 1);

			if (coords[0]) {
				var coord = coords[0];

				// Rescale coordinates from detector to video coordinate space:
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

				// Draw coordinates on video overlay:
				context.beginPath();
				context.lineWidth = '2';
				context.fillStyle = fist_pos_old ? 'rgba(0, 255, 255, 0.3)' : 'rgba(255, 0, 0, 0.3)';
				context.fillRect(
					coord[0] / video.videoWidth * canvas.clientWidth,
					coord[1] / video.videoHeight * canvas.clientHeight,
					coord[2] / video.videoWidth * canvas.clientWidth,
					coord[3] / video.videoHeight * canvas.clientHeight);
				context.stroke();
			} else fist_pos_old = null;
		}
	}
}



function fadeOut(el, callback) {
	el.style.opacity = 1;

	var last = +new Date();
	var tick = function() {
		el.style.opacity = +el.style.opacity - (new Date() - last) / 600;
		last = +new Date();

		if (+el.style.opacity > 0) {
			(window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		} else {
			el.style.display = 'none';
			callback();
		}
	};

	tick();
}

function fadeIn(el, callback) {
	el.style.opacity = 0;

	var last = +new Date();
	var tick = function() {
		el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
		last = +new Date();

		if (+el.style.opacity < 1) {
			(window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		} else {
			callback();
		}
	};

	tick();
}

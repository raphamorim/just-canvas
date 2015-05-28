var Utils = {
	fadeOut: function (el, callback) {
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
	},
	fadeIn: function(el, callback) {
		el.style.opacity = 0;
		var last = +new Date();
		var tick = function() {
			el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
			last = +new Date();

			if (+el.style.opacity < 1) {
				(window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
			} else {
				if (typeof callback === 'undefined') return true;
				callback();
			}
		};
		tick();
	}
};

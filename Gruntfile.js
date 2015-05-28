module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		uglify: {
			main: {
				files: {
					"source/app.js": [
                        "build/js/compatibility.js",
                        "build/js/smoother.js",
                        "build/js/objectdetect.js",
                        "build/js/utils.js",
                        "build/js/app.js"
                    ]
				}
			}
		},

		cssmin: {
 			target: {
    			files: [{
      				expand: true,
      				cwd: 'build/css',
      				src: ['*.css', '!*.min.css'],
      				dest: 'source',
      				ext: '.min.css'
    			}]
  			}
		}
    });

	[
		'grunt-contrib-uglify',
		'grunt-contrib-cssmin'
	].forEach( function( task ) {
		grunt.loadNpmTasks( task );
	});

	grunt.registerTask('default', ['uglify', 'cssmin']);
};
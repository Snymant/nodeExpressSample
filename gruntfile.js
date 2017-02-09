//http://brianflove.com/2016/11/08/typescript-2-express-node/
module.exports = function (grunt) {
	"use strict";

	grunt.initConfig({
		copy: {
			build: {
				files: [
					{
						expand: true,
						cwd: "./public",
						src: ["**"],
						dest: "./dist/public"
					},
					{
						expand: true,
						cwd: "./views",
						src: ["**"],
						dest: "./dist/views"
					}
				]
			}
		},
		ts: {
			app: {
				files: [{
					src: ["src/\*\*/\*.ts", "!src/.baseDir.ts"],
					dest: "./dist"
				}],
				options: {
					module: "commonjs",
					target: "es6",
					sourceMap: false
				}
			}
		},
		execute: {
			target: {
				src: ['./bin/www']
			}
		},
		open: {
			src: {
				// Gets the port from the connect configuration
				path: 'http://localhost:8080',
				app: 'Google Chrome',
				options: {
					delay: 2000
				}
			},
			web: {
				// Gets the port from the connect configuration
				path: 'http://localhost:8080'
			}
		},
		watch: {
			ts: {
				files: ["src/\*\*/\*.ts"],
				tasks: ["ts"]
			},
			views: {
				files: ["views/**/*.pug"],
				tasks: ["copy"]
			},
			server: {
				files: ['.rebooted'],
				options: {
					livereload: 35729
				}
			}
		},
		nodemon: {
			dev: {
				script: 'bin/www',
				options: {
					delay: 2000,
					watch: ['bin','dist'],
					callback: function (nodemon) {
						nodemon.on('log', function (event) {
							console.log(event.colour);
						});
						nodemon.on('restart', function () {
							// Delay before server listens on port 
							setTimeout(function () {
								require('fs').writeFileSync('.rebooted', 'rebooted');
							}, 1000);
						});
					}
				}
			}
		},
		concurrent: {
			dev: {
				tasks: ['nodemon:dev', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		},
		wait: {
			one: {
				options: {
					delay: 1000
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks("grunt-open");
	grunt.loadNpmTasks("grunt-execute");
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-wait');

	grunt.registerTask("default", [
		"copy",
		"ts",
		"open:src",
		"concurrent"
	]);

};

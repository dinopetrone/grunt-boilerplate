/*global module:false, __dirname:false, require:false, process:false*/
var dust = require('dustjs-linkedin');
dust.optimizers.format = function(ctx, node) { return node };
//if `grunt production` was run, build according to production rules
var isProduction = process.argv.indexOf('production') > 0;

//similar to underscore's _.defaults()
var defaults = function( obj, dflts ){
	var result = {}, prop;
	//put all defaults in first
	for( prop in dflts ){
		if( dflts.hasOwnProperty( prop ) ){
			result[prop] = dflts[prop];
		}
	}
	//override with any obj props
	for( prop in obj ){
		if( obj.hasOwnProperty( prop ) ){
			result[prop] = obj[prop];
		}
	}
	//return combined
	return result;
};


var pages = {
	'index': { title: 'Home' },
};



function makePage( name, variables ){
	//clear the dust cache so files change during `watch`
	dust.cache = {};
	variables = defaults( variables, {
		cache: false,
		views: __dirname + '/app/templates',
		title: '',
		debug: !isProduction,
		pretty: !isProduction
	});
	return {
		src: 'app/templates/' + name + '.dust.html',
		dest: 'app/' +name+ '.html',
		engine: 'dust',
		variables: variables
	};
}

module.exports = function(grunt) {


	var templates = {};
	Object.keys( pages ).forEach(function( key ){
		templates[key] = makePage( key, pages[key] );
	});

	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},
		jshint: {
			all: ['Gruntfile.js', 'app/static/js/app/*.js', 'app/static/js/app/**/*.js'],
			options: {
				eqeqeq: true,
				immed: true,
				latedef: false,
				regexdash: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				globals: {
					jQuery: true,
					define: true,
					require: true,
					window: true,
					console: true,
					document: true
				}
			}
		},
		compass: {
			dist: {
				options: {
					basePath: 'app/',
                    cssDir: 'static/css',
                    sassDir: 'static/css/src',
                    imagesDir: 'static/images',
                    outputStyle: isProduction ? 'compressed' : 'compact',
                    noLineComments: isProduction
				}
			}
		},
		template: templates,
		//regarde is watch but fancier
		regarde: {
			compass: {
				files: [
					'app/static/css/src/*.{scss,sass}'
				],
				tasks: ['compass']
			},
			template: {
				files: [ 'app/templates/*.html'],
				tasks: ['template']
			}
		},
		requirejs: {
			compile: {
				options: {
					appDir: 'app/',
					baseUrl: 'static/js',
					dir: './production',
					optimizeCss: 'standard',
					findNestedDependencies: true,
					preserveLicenseComments: false,
					pragmas: {
						hostedBySunovian: true
					},
						//re-route libs to top-level
					paths: {
						'templates': '../templates',
					},
					modules: [
						{
							name: 'main'
						}
					]
				}
			}
		},
		connect: {
			server: {
				options: {
					port: 8000,
					base: 'app',
					keepalive: true
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-regarde');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-templater');
	grunt.registerTask('default', ['template', 'compass', 'regarde']);
	grunt.registerTask('watch', ['regarde']);
	grunt.registerTask('production', ['template', 'compass', 'requirejs']);

};



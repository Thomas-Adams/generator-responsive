'use strict';
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator');



function ResponsiveGenerator(args, options, config) {
	  yeoman.generators.Base.apply(this, arguments);

	  this.argument('appname', {
	    desc: 'create an campaign with name [appname]',
	    type: Boolean,
	    required: false,
	    defaults: path.basename(process.cwd())
	  });

	  this.on('end', function () {
	    this.installDependencies({skipInstall: options['skip-install']});
	  });

	  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../../package.json')));
}

util.inherits(ResponsiveGenerator, yeoman.generators.Base);


ResponsiveGenerator.prototype.askFor = function() {
	var cb = this.async(), root = this;
	
	 var prompts = [
	                
	        {
			    type: 'list',
			    name: 'cssFramework',
			    message: 'Select the CSS framework you want',
			    'default': 'None',
			    choices: ['None', 'Bootstrap', 'Skeleton']
			}, 
			
			{
			    type: 'checkbox',
			    name: 'sassLibraries',
			    message: 'Select the SASS libraries you want',
			    'default': ['Bourbon'],
			    choices: ['Bourbon', 'Neat', 'Bitters', 'Refills']
			}, 
			
			{
			    type: 'list',
			    name: 'navigation',
			    message: 'Select the navigation you want',
			    'default': 'Slide in off-canvas left',
			    choices: ['Slide in off-canvas left', 'Slide in off-canvas right']
			}, 
			
			{
			    type: 'list',
			    name: 'pageTransition',
			    message: 'Select the page transition you want',
			    'default': 'Page wise scrolling',
			    choices: ['Page wise scrolling', 'Endless scrolling']
			}
	 ];
	
	 var answersCallback = (function (answers) {
		 this.cssFramework = answers.cssFramework;
		 this.sassLibraries = answers.sassLibraries;
		 this.navigation = answers.navigation;
		 this.pageTransition = answers.pageTransition;
		 cb();
	 }).bind(this);
	
	 this.prompt(prompts, answersCallback);
};


ResponsiveGenerator.prototype.basicSetup = function() {
	 this.mkdir('public');
	 this.mkdir('public/_common');
	 this.mkdir('public/_common/css');
	 this.mkdir('public/_common/css/fonts');
	 this.mkdir('public/_common/css/images');
	 this.mkdir('public/_common/js');
	 this.mkdir('public/_common/js/lib/vendor');
	 this.mkdir('public/_common/js/plugins');
	 this.mkdir('public/_common/js/src');
	 this.mkdir('public/_media');
	 this.mkdir('sass');
};


'use strict';
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    htmlWiring = require('html-wiring'),
    mkdirp = require('mkdirp'),
    nunjucks = require('nunjucks');

var PageGenerator = module.exports = function PageGenerator(args, options, config) {
	  // By calling `NamedBase` here, we get the argument to the subgenerator call
	  // as `this.name`.
	  yeoman.Base.apply(this, arguments);
};

util.inherits(PageGenerator, yeoman.Base);


PageGenerator.prototype.prompting = {
		
		pageName: function() {
            var done = this.async();

            var prompt = [{
                type: 'input',
                name: 'pageName',
                message: 'Enter the complete path to the page',
                'default': path.basename(process.cwd())
            }];

            this.prompt(prompt, function(response) {
                this.options.pageName = response.pageName;
                done();
            }.bind(this));
        },
        
        pageTransition : function()  {
        	
        	 var done = this.async();

             var prompt = [{
	            type: 'list',
	            name: 'pageTransition',
	            message: 'Select the page transition you want',
	            'default': 'None',
	            choices: ['None', 'vertical', 'horizontal']
        	}];

            this.prompt(prompt, function(response) {
            	this.options.pageTransition = response.pageTransition;
                done();
            }.bind(this));
		},
        
        menuPosition :  function()  { 
        	var done = this.async();

	        var prompt = [{
	        	type: 'list',
	            name: 'menuPosition',
	            message: 'Select the menu position you want',
	            'default': 'Left',
	            choices: ['Left', 'Top', 'Right']
	        }];
	        this.prompt(prompt, function(response) {
            	this.options.menuPosition = response.menuPosition;
                done();
            }.bind(this));
        },
        
        accordionMenu :  function()  { 
        	var done = this.async();

	        var prompt = [{
	        	type: 'list',
	            name: 'accordionMenu',
	            message: 'Select the type of the menu you want',
	            'default': 'Left',
	            choices: ['Flat', 'Accordion']
	        }];
	        this.prompt(prompt, function(response) {
            	this.options.accordionMenu = response.accordionMenu;
                done();
            }.bind(this));
	        
        },
        
        slideCount : function() {
                var done = this.async();

                var prompt = [{
                    type: 'input',
                    name: 'slideCount',
                    message: 'Enter number of sections',
                    'default': '2'
                }];

                this.prompt(prompt, function(response) {
                    this.options.slideCount = response.slideCount;
                    done();
                }.bind(this));
        },
        
        globalTransitionEffect : {
        	
        	
        	
        }
        
        
		
			
};




/*
module.exports = yeoman.Base.extend({
   
    prompting: {

        pageName: function() {
            var done = this.async();

            var prompt = [{
                type: 'input',
                name: 'pageName',
                message: 'Enter a pageName including the full path.',
                'default': 'index.html'
            }];

            this.prompt(prompt, function(response) {
                this.options.pageName = response.pageName;
                done();
            }.bind(this));
        },

        navigation: function() {
            var done = this.async();

            var prompt = [{
                type: 'list',
                name: 'navigation',
                message: 'Select the navigation you want',
                'default': 'Slide in off-canvas left',
                choices: ['Slide in off-canvas left', 'Slide in off-canvas right', 'Left opoup menu', 'Right popup menu']
            }];

            this.prompt(prompt, function(response) {
                this.options.navigation = response.navigation;
                done();
            }.bind(this));
        },

        pageTransition: function() {
            var done = this.async();

            var prompt = [{
                type: 'list',
                name: 'pageTransition',
                message: 'Select the page transition you want',
                'default': 'Page wise scrolling',
                choices: ['Page wise scrolling', 'Infinte scrolling']
            }, {
                when: function(response) {
                    if (response.pageTransition === 'Page wise scrolling') {
                        return true;
                    } else {
                        return false;
                    }
                },
                type: 'input',
                name: 'numberOfPages',
                message: 'How many pages do you want to include?',
                'default': 5
            }];
            this.prompt(prompt, function(response) {
                this.options.pageTransition = response.pageTransition;
                this.options.numberOfPages = response.numberOfPages;
                done();
            }.bind(this));
        },

        components: function() {
            var done = this.async();

            var prompt = [{
                type: 'checkbox',
                name: 'components',
                message: 'Select components for the page',
                'default': ['Carousel'],
                choices: ['Carousel', 'Card', 'Video', 'Parallax']
            }];

            this.prompt(prompt, function(response) {
                this.options.components = response.components;
                done();
            }.bind(this));
        }
    },
    writing: {
        
    }
});
*/
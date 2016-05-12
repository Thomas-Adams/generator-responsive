'use strict';
var util = require('util'),
    path = require('path'),
    fs = require('fs'),
    yeoman = require('yeoman-generator'),
    htmlWiring = require('html-wiring'),
    mkdirp = require('mkdirp'),
    nunjucks = require('nunjucks'),
    chalk = require('chalk');

var globalTransitionEffects = ['moveFromRight' ,'moveFromLeft' ,'moveFromBottom' ,'moveFromTop' ,'moveFromRight ontop' ,'moveFromLeft ontop' ,'moveFromBottom ontop' ,'moveFromTop ontop' ,'moveFromRightFade' ,'moveFromLeftFade' ,'moveFromBottomFade' ,'moveFromTopFade' ,'moveFromRight' ,'moveFromLeft' ,'moveFromBottom' ,'moveFromTop' ,'moveFromRight ontop' ,'moveFromLeft ontop' ,'moveFromBottom ontop' ,'moveFromTop ontop' ,'scaleUpDown delay300' ,'scaleUp delay300' ,'scaleUp Left' ,'scaleUp Right' ,'scaleUp Top' ,'scaleUp Bottom' ,'scaleUpCenter delay400' ,'moveFromRight delay200 ontop' ,'moveFromLeft delay200 ontop' ,'moveFromTop delay200 ontop' ,'moveFromBottom delay200 ontop' ,'flipInLeft delay500' ,'flipInRight delay500' ,'flipInBottom delay500' ,'flipInTop delay500' ,'scaleUp' ,'rotateInNewspaper delay500' ,'moveFromRight' ,'moveFromLeft' ,'moveFromBottom' ,'moveFromTop' ,'rotatePullRight delay180' ,'rotatePullLeft delay180' ,'rotatePullBottom delay180' ,'rotatePullTop delay180' ,'moveFromRightFade' ,'moveFromLeftFade' ,'moveFromBottomFade' ,'moveFromTopFade' ,'rotateUnfoldLeft' ,'rotateUnfoldRight' ,'rotateUnfoldTop' ,'rotateUnfoldBottom' ,'rotateRoomLeftIn' ,'rotateRoomRightIn' ,'rotateRoomTopIn' ,'rotateRoomBottomIn' ,'rotateCubeLeftIn' ,'rotateCubeRightIn' ,'rotateCubeTopIn' ,'rotateCubeBottomIn' ,'rotateCarouselLeftIn' ,'rotateCarouselRightIn' ,'rotateCarouselTopIn' ,'rotateCarouselBottomIn' ,'rotateSidesIn delay200' ,'rotateSlideIn'];

var PageGenerator = module.exports = function PageGenerator(args, options, config) {
	  // By calling `NamedBase` here, we get the argument to the subgenerator call
	  // as `this.name`.	 
	  yeoman.Base.apply(this, arguments);
};

util.inherits(PageGenerator, yeoman.Base);



PageGenerator.prototype.initializing = function() {
		this.menus = [];	
		this.options.leftTransition=null;
		this.options.rightTransition=null;
		this.options.topTransition=null;
		this.options.menuTransition=null;
		this.options.charset="utf-8";
};

PageGenerator.prototype.prompting = {
		
		pageName: function() {
            var done = this.async();

            var prompt = [{
                type: 'input',
                name: 'pageName',
                message: chalk.green.bold('Enter the complete path to the page,\nstarting from the app root\nlike for example ./cn/index.html: '),   
                validate : function(input) {
                	try {
                		if(input!=null && input!='' && input!='undefined') {
                			
                			if(input.startsWith("./")) {
                				path.normalize(input);
                			} else if (input.startsWith("/")) {
                				path.normalize("." + input);
                			} else if (input.startsWith(".")) {
                				path.normalize("./" + input.subsstring(1));
                			} else {
                				path.normalize("./" + input);
                			}                			
                			return true;
                		} else {
                			console.log(chalk.red.bold('Page name cannot be empty!'));
                			return chalk.red.bold('Page name cannot be empty!');
                		}
                		
                	} catch (err) {
                		console.log(chalk.red.bold('Error in path expression : ' +err));
                		return chalk.red.bold('Error in path expression : ' +err);
                	}
                	
                	
                	
                }
            }];

            this.prompt(prompt, function(response) {
            	var input = response.pageName;
            	if(input.startsWith("./")) {
            		this.options.pageName=path.normalize(input);
    			} else if (input.startsWith("/")) {
    				this.options.pageName=path.normalize("." + input);
    			} else if (input.startsWith(".")) {
    				this.options.pageName=path.normalize("./" + input.subsstring(1));
    			} else {
    				this.options.pageName=path.normalize("./" + input);
    			}    
            	console.log(this.options.pageName);
                done();
            }.bind(this));
        },
        
        pageTransition : function()  {
        	
        	 var done = this.async();

             var prompt = [{
	            type: 'list',
	            name: 'pageTransition',
	            message: chalk.green.bold('Select the page transition you want: '),
	            'default': 'None',
	            choices: ['None', 'vertical', 'horizontal','infinite scrolling']
        	}];

            this.prompt(prompt, function(response) {
            	this.options.pageTransition = response.pageTransition;
                done();
            }.bind(this));
		},
		
		fonts : function() {
			var done = this.async();
			
			var prompt = [{
	        	type: 'checkbox',
	            name: 'fonts',
	            message: chalk.green.bold('Select the fonts you want (note : font awesome is mandatory): '),
	            'default': ['font-awesome'],
	            choices: ['bmw-fonts', 'font-awesome']
	        }];
			 
			this.prompt(prompt, function(response) {
				this.options.fonts = response.fonts;
	            done();
	        }.bind(this));
		},
		
		pageTitle : function() {
            var done = this.async();

            var prompt = [{
                type: 'input',
                name: 'pageTitle',
                message: chalk.green.bold('Enter the title of the page: ')
            }];

            this.prompt(prompt, function(response) {
                this.options.pageTitle = response.pageTitle;
                done();
            }.bind(this));
        },
        
        pageDescription : function() {
            var done = this.async();

            var prompt = [{
                type: 'input',
                name: 'pageDescription',
                message: chalk.green.bold('Enter the description of the page: ')
            }];

            this.prompt(prompt, function(response) {
                this.options.pageDescription = response.pageDescription;
                done();
            }.bind(this));
        },
        
        menuPosition :  function()  { 
        	var done = this.async();

	        var prompt = [{
	        	type: 'list',
	            name: 'menuPosition',
	            message: chalk.green.bold('Select the menu position you want: '),
	            'default': 'Left',
	            choices: ['Left', 'Top', 'Right']
	        }, {
	        		when: function(response) {
	        				if (response.menuPosition === 'Left') {
	        					return true;
	        				} else {
	        					return false;
	        				}
	        		},
	        		
	        		type: 'list',
	        		name: 'leftTransition',
	        		message: chalk.green.bold('Select the menu transition you want: '),
	        		'default': 'Show',
	 	            choices: ['Push', 'Show']
	        }, {
		        when: function(response) {
	    				if (response.menuPosition === 'Right') {
	    					return true;
	    				} else {
	    					return false;
	    				}
	    			},
	    		
	    		type: 'list',
	    		name: 'rightTransition',
	    		message: chalk.green.bold('Select the menu transition you want: '),
	    		'default': 'Show',
		        choices: ['Push', 'Show']
	        }, {
        		when: function(response) {
    				if (response.menuPosition === 'Top') {
    					return true;
    				} else {
    					return false;
    				}
	    		},	    		
	    		type: 'list',
	    		name: 'topTransition',
	    		message: chalk.green.bold('Select the menu transition you want: '),
	    		'default': 'Show',
		        choices: ['Show']		        
        	}];
	        
	        this.prompt(prompt, function(response) {
	        	this.options.menuPosition = response.menuPosition;
	            this.options.leftTransition = response.leftTransition;
	            this.options.rightTransition = response.rightTransition;
	            this.options.topTransition = response.topTransition;
	            if(response.leftTransition) {
	            	this.options.menuTransition=response.leftTransition;
	            }
	            if(response.topTransition) {
	            	this.options.menuTransition=response.topTransition;
	            }
	            if(response.rightTransition) {
	            	this.options.menuTransition=response.rightTransition;
	            }	            
                done();
            }.bind(this));
        },

        
        accordionMenu :  function()  { 
        	var done = this.async();

	        var prompt = [{
	        	type: 'list',
	            name: 'accordionMenu',
	            message: chalk.green.bold('Select the type of the menu you want: '),
	            'default': 'Flat',
	            choices: ['Flat', 'Accordion']
	        }];
	        this.prompt(prompt, function(response) {
            	this.options.accordionMenu = response.accordionMenu;
                done();
            }.bind(this));
	        
        },
        
        
   
        globalTransitionEffect : function() {
        	var done = this.async();
        	
        	var prompt = [{
	        	type: 'list',
	            name: 'globalTransitionEffect',
	            message: chalk.green.bold('Select the global transition effect you want: '),
	            'default': 'moveFromRight',
	            choices: globalTransitionEffects
	        }];
        	
        	this.prompt(prompt, function(response) {
                this.options.globalTransitionEffect = response.globalTransitionEffect;
                this.options.globalTransitionEffectIndex= globalTransitionEffects.indexOf(this.options.globalTransitionEffect);
                done();
            }.bind(this));
        },
        
        
        usedComponents : function() {
        	var done = this.async();
        	
        	var prompts = [{
                type: 'checkbox',
                name: 'usedComponents',
                message: chalk.green.bold('Which components do you want to use in this page? : '),
                'default' : [],
                choices : ['Cards', 'Carousel', 'Paragraph']
            }];
            
            this.prompt(prompts, function(response) {
                this.options.usedComponents = response.usedComponents;
                done();
            }.bind(this));
            
        },
        
        gsapLibraries : function() {
        	var done = this.async();
        	
        	var prompts = [{
                type: 'checkbox',
                name: 'gsapLibraries',
                message: chalk.green.bold('Which GSAP libraries do you want to use: '),
                'default' : [],
                choices : ['jquery.gsap.js','TimelineLite.js', 'TweenLite.js','TimelineMax.js', 'TweenMax.js']
            }];
            
            this.prompt(prompts, function(response) {
                this.options.gsapLibraries = response.gsapLibraries;
                done();
            }.bind(this));            
        },
        
        menuTitle :  function()  { 
        	var done = this.async();

	        var prompt = [{
	        	type: 'input',
	            name: 'menuTitle',
	            message: chalk.green.bold('Enter the title of the menu you want: ')	            
	        }];
	        this.prompt(prompt, function(response) {
            	this.options.menuTitle = response.menuTitle;
                done();
            }.bind(this));
	        
        },
        
        menuEntries : function() {   
        	var done =  this.async(), self =this;
        	
            var prompts = [{
                type: 'input',
                name: 'menuEntryTitle',
                message: chalk.green.bold('Enter the menu title: '),
            }, {
            	type: 'input',
                name: 'menuEntryBackgroundImage',
                message: chalk.green.bold('Enter the corresponding background image url: '),
            }, {
              type: 'confirm',
              name: 'continueMenuEntries',
              message: chalk.green.bold('add another menu entry? Y/N :'), 
              'default' : false	  
            }];
            
            
            function responseHandler(props) {
            	//console.log("answer: " + props.continueMenuEntries);
            	//console.log("menus: " + self.menus.join(', '));
            	var menuEntry ={};
            	
            	if(props.menuEntryTitle) {
            		menuEntry.title = props.menuEntryTitle;
            		menuEntry.backGroundImage = props.menuEntryBackgroundImage;
            		self.menus.push(menuEntry);
            		//console.log("menus: " + self.menus.join(', '));
            	}
            	if(props.continueMenuEntries) {
            		self.prompt(prompts, responseHandler);
            	} else {
            		self.options.menus = self.menus;
            		done();
            	}
            }
             
            this.prompt(prompts, function (props) {            	
            	responseHandler(props);
            }.bind(this));
            
        },
        
        headerText : function(){
        	var done = this.async();

	        var prompt = [{
	        	type: 'input',
	            name: 'headerText',
	            message: chalk.green.bold('Enter the header text you want: ')	            
	        }];
	        this.prompt(prompt, function(response) {
            	this.options.headerText = response.headerText;
                done();
            }.bind(this));
        },
        
        logoPath : function(){
        	var done = this.async();

	        var prompt = [{
	        	type: 'input',
	            name: 'logoPath',
	            message: chalk.green.bold('Enter the path to the logo image starting from root: '),
	            'default' : '_media/examples/logo/bmw-logo.png'
	        }];
	        this.prompt(prompt, function(response) {
            	this.options.logoPath = response.logoPath;
                done();
            }.bind(this));
        }
        
        
};



PageGenerator.prototype.writing = {
	
		basicSetup: function() {
			
			//1. Create the complete path to the pageName			
			var absoluteFileName =  process.cwd() + path.sep +  this.options.pageName;			
			var dir = path.dirname(absoluteFileName);
			mkdirp(dir);
			
			//2. render file
			var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('G:/_node_workspaces/generator-responsive/page/templates'));
			var res = env.render('page-transition-vertical.tmpl.nun', this.options);
			fs.writeFileSync(absoluteFileName, res);
		}
	
	
};

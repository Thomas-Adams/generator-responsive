'use strict';
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    htmlWiring = require('html-wiring'),
    mkdirp = require('mkdirp');



module.exports = yeoman.Base.extend({
    constructor: function() {
        yeoman.Base.apply(this, arguments);

        this.argument('appname', {
            desc: 'create an campaign with name [appname]',
            type: Boolean,
            required: false,
            defaults: path.basename(process.cwd())
        });
        this.config.save();
    },

    prompting: {

        appname: function() {
            var done = this.async();

            var prompt = [{
                type: 'input',
                name: 'appname',
                message: 'Enter directory name',
                'default': path.basename(process.cwd())
            }];

            this.prompt(prompt, function(response) {
                this.options.appname = response.appname;
                done();
            }.bind(this));
        },
        cssFramework: function() {
            var done = this.async();

            var prompt = [{
                type: 'list',
                name: 'cssFramework',
                message: 'Select the CSS framework you want',
                'default': 'None',
                choices: ['None', 'Bootstrap', 'Skeleton']
            }, {
                when: function(response) {
                    if (response.cssFramework === 'Bootstrap') {
                        return true;
                    } else {
                        return false;
                    }
                },
                type: 'checkbox',
                name: 'bootstrapModules',
                message: 'Which Bootstrap modules do you want to include?',
                'default': ['Variables', 'Mixins', 'Normalize', 'Glyphicons', 'Scaffolding', 'Grid', 'Utilities', 'Responsive utilities'],
                choices: ['Variables', 'Mixins', 'Normalize', 'Print', 'Glyphicons', 'Scaffolding', 'Type', 'Code', 'Grid',
                    'Tables', 'Forms', 'Buttons', 'Component animations', 'Dropdowns', 'Button groups', 'Input groups',
                    'Navigations', 'Navigation bar', 'Breadcrumbs', 'Pagination', 'Pager', 'Labels', 'Badges',
                    'Jumbotron', 'Thumbnails', 'Alerts', 'Progress bars', 'Media', 'List group', 'Panels', 'Responsive embed',
                    'Wells', 'Close', 'Modals', 'Tooltip', 'Popovers', 'Carousel', 'Utilities', 'Responsive utilities', 'Themes'
                ]
            }, {
                when: function(response) {
                    if (response.cssFramework === 'Skeleton') {
                        return true;
                    } else {
                        return false;
                    }
                },
                type: 'checkbox',
                name: 'skeletonModules',
                message: 'Which Skeleton modules do you want to include?',
                'default': ['Functions', 'Variables', 'Utils', 'Normalize', 'Base styles', 'Typography', 'Media queries'],
                choices: ['Functions', 'Variables', 'Utils', 'Normalize', 'Base styles', 'Typography',
                    'Spacing', 'Buttons', 'Code', 'Forms', 'Grid', 'Lists', 'Media queries', 'Tables'
                ]
            }];

            this.prompt(prompt, function(response) {
                this.options.cssFramework = response.cssFramework;
                this.options.bootstrapModules = response.bootstrapModules;
                this.options.skeletonModules = response.skeletonModules;
                done();
            }.bind(this));
        },

        sassLibraries: function() {
            var done = this.async();

            var prompt = [{
                type: 'checkbox',
                name: 'sassLibraries',
                message: 'Select the SASS libraries you want',
                'default': ['Bourbon'],
                choices: ['Bourbon', 'Neat', 'Bitters', 'Refills']
            }];

            this.prompt(prompt, function(response) {
                this.options.sassLibraries = response.sassLibraries;
                done();
            }.bind(this));
        },

        buildTool: function() {
            var done = this.async();

            var prompt = [{
                type: 'list',
                name: 'buildTool',
                message: 'Select build tool/script you want',
                'default': 'None',
                choices: ['None', 'Grunt', 'Gulp']
            }];

            this.prompt(prompt, function(response) {
                this.options.buildTool = response.buildTool;
                done();
            }.bind(this));
        }
    },

    writing: {
        basicSetup: function() {
            mkdirp('public');
            mkdirp('public/_common');
            mkdirp('public/_common/css');
            mkdirp('public/_common/css/fonts');
            mkdirp('public/_common/css/images');
            mkdirp('public/_common/js');
            mkdirp('public/_common/js/lib/vendor');
            mkdirp('public/_common/js/plugins');
            mkdirp('public/_common/js/src');
            mkdirp('public/_media');
            mkdirp('public/_media/images');
            mkdirp('public/_media/videos');
            mkdirp('sass');


            if (this.options.sassLibraries.indexOf('Bitters')) {
                this.sourceRoot(path.join(__dirname, 'templates', 'sass'));
                this.directory('bitters', 'sass/bitters');
            }

            if (this.options.sassLibraries.indexOf('Bourbon')) {
                this.sourceRoot(path.join(__dirname, 'templates', 'sass'));
                this.directory('bourbon', 'sass/bourbon');
            }
            if (this.options.sassLibraries.indexOf('Neat')) {
                this.sourceRoot(path.join(__dirname, 'templates', 'sass'));
                this.directory('neat', 'sass/neat');
            }
            if (this.options.sassLibraries.indexOf('Refills')) {
                mkdirp('sass/refills');
            }
            if (this.options.cssFramework === 'Bootstrap') {
                this.sourceRoot(path.join(__dirname, 'templates', 'sass', 'bootstrap'));
                mkdirp('sass/bootstrap');
                this.copy('_bootstrap-variables.scss', 'sass/bootstrap/_bootstrap-variables.scss');
                this.template('bootstrap.scss.ejs', 'sass/bootstrap/bootstrap.scss', this.options);
            }
            if (this.options.cssFramework === 'Skeleton') {
                this.sourceRoot(path.join(__dirname, 'templates', 'sass', 'skeleton'));
                mkdirp('sass/skeleton');
                this.directory('base', 'sass/skeleton/base');
                this.directory('modules', 'sass/skeleton/modules');
                this.template('skeleton.scss.ejs', 'sass/skeleton/skeleton.scss', this.options);
            }

        },
        setupApp: function() {

            this.sourceRoot(path.join(__dirname, 'templates', 'basic'));
            this.directory('bin', 'bin');
            this.directory('routes', 'routes');
            this.copy('.bowerrc', '.bowerrc');
            this.copy('.gitignore', '.gitignore');
            this.copy('.jshintrc', '.jshintrc');
            this.copy('app.js', 'app.js');
            this.copy('bower.json', 'bower.json');
            this.template('config.rb.ejs', 'config.rb', this.options);
            this.template('package.json.ejs', 'package.json', this.options);
            this.sourceRoot(path.join(__dirname, 'templates', 'public', '_common', 'js', 'plugins'));
            this.copy('io-loader.js', 'public/_common/js/plugins/io-loader.js');
            this.copy('io-menu.js', 'public/_common/js/plugins/io-menu.js');
            this.copy('io-simple-page-transition.js', 'public/_common/js/plugins/io-simple-page-transition.js');
        }
    },

    install: function() {
        this.installDependencies({
            bower: true,
            npm: true,
            callback: function() {
                console.log('Everything is ready!');
            }
        });
    }
});

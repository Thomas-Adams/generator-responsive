'use strict';
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    htmlWiring = require('html-wiring');



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
        cssFramework: function() {
            var done = this.async();

            var prompt = [{
                type: 'list',
                name: 'cssFramework',
                message: 'Select the CSS framework you want',
                'default': 'None',
                choices: ['None', 'Bootstrap', 'Skeleton'],
                store: true
            }];

            this.prompt(prompt, function(response) {
                this.options.cssFramework = response.cssFramework;
                done();
            }.bind(this));
        },

        bootstrapModules: function() {
            var done = this.async();

            var prompt = [{
                when: 'cssFramework.Bootstrap',
                name: 'bootstrapModules',
                message: 'Which Bootstrap modules do want to include?',
                'default': ['Variables', 'Mixins', 'Normalize', 'Glyphicons', 'Scaffolding', 'Grid', 'Utilities', 'Responsive utilities'],
                choices: ['Variables', 'Mixins', 'Normalize', 'Print', 'Glyphicons', 'Scaffolding', 'Type', 'Code', 'Grid',
                    'Tables', 'Forms', 'Buttons', 'Component animations', 'Dropdowns', 'Button groups', 'Input groups',
                    'Navigations', 'Navigation bar', 'Breadcrumbs', 'Pagination', 'Pager', 'Labels', 'Badges',
                    'Jumbotron', 'Thumbnails', 'Alerts', 'Progress bars', 'Media', 'List group', 'Panels', 'Responsive embed',
                    'Wells', 'Close', 'Modals', 'Tooltip', 'Popovers', 'Carousel', 'Utilities', 'Responsive utilities', 'Themes'
                ]
            }];

            this.prompt(prompt, function(response) {
                this.options.bootstrapModules = response.bootstrapModules;
                done();
            }.bind(this));
        },

        skeletonModules: function() {
            var done = this.async();

            var prompt = [{
                when: 'cssFramework.Skeleton',
                name: 'skeletonModules',
                message: 'Which Skeleton modules do want to include?',
                'default': ['Functions', 'Variables', 'Utils', 'Normalize', 'Base styles', 'Typography', 'Media queries'],
                choices: ['Functions', 'Variables', 'Utils', 'Normalize', 'Base styles', 'Typography',
                    'Spacing', 'Buttons', 'Code', 'Forms', 'Grid', 'Lists', 'Media queries', 'Tables'
                ]
            }];

            this.prompt(prompt, function(response) {
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
            }];

            this.prompt(prompt, function(response) {
                this.options.pageTransition = response.pageTransition;
                done();
            }.bind(this));
        }
    },

    writing: {
        basicSetup: function() {
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
            this.mkdir('public/_media/images');
            this.mkdir('public/_media/videos');
            this.mkdir('sass');
        }
    }
});

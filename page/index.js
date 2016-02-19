'use strict';
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    htmlWiring = require('html-wiring'),
    mkdirp = require('mkdirp'),
    nunjucks = require('nunjucks');


module.exports = yeoman.Base.extend({
    constructor: function() {
        yeoman.Base.apply(this, arguments);
    },

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
        //TODO: implement templates
    }
});

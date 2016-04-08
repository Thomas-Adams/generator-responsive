module.exports = function(grunt) {
    var port = grunt.option('port') || 3366;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        webfont: {
            bmw: {
                src: './fonts/generated/web.svg',
                dest: './public/_common/css/fonts/',
                options: {
                    font: 'bmw',
                    fontFileName: 'bmw-{hash}',
                    hashes: true,
                    styles: 'font,icon',
                    types: ['eot', 'woff2', 'woff', 'ttf', 'svg']
                }
            }
        },

        watch: {
            fonts: {
                files: ['**/*.svg'],
                tasks: ['webfont'],
                options: {
                    spawn: true,
                },
            },
        },
    });

    grunt.loadNpmTasks('grunt-webfont');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('webfont', ['webfont']);
};

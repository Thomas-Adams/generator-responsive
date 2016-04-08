var gulp = require('gulp'),
    watch = require('gulp-watch'),
    path = require('path'),
    compass = require('gulp-compass'),
    notify = require('gulp-notify'),
    gulpFont = require('./build/gulpFont.js'),
    gulpOTF = require('./build/gulpOTF.js'),
    gulpSVG = require('./build/gulpSVG.js'),
    gulpEOT = require('./build/gulpEOT.js'),
    gulpWOFF = require('./build/gulpWOFF.js'),
    gulpWOFF2 = require('./build/gulpWOFF2.js'),
    jshint = require('gulp-jshint');

gulp.task('compass', function() {
    gulp.src('./sass/**/*.scss')
        .pipe(compass({
                config_file: './config.rb',
                css: './public/_common/css',
                sass: './sass'
            })
            .on("error", notify.onError(function(error) {
                return "Failed to Compile SCSS: " + error.message;
            })))
        .pipe(gulp.dest('./public/_common/css'))
        .pipe(notify("SCSS Compiled Successfully :)"));
});

gulp.task('font', function() {
    gulp.src('./public/*.html').pipe(gulpFont('./public/', {
        originalFontFile: './fonts/BMWTypeChinese.ttf',
        generatedFontFile: './fonts/generated/web.ttf',
        matchTags: [{
            tag: "h2",
            attribute: "class=title"
        }, {
            tag: "h3",
            attribute: "class=subtitle"
        }]
    }));
});

gulp.task('ttf2otf', function() {
    gulp.src('./fonts/generated/web.ttf').pipe(gulpOTF({
        subsettedTTF: './fonts/generated/web.ttf'
    }));
});

gulp.task('ttf2svg', function() {
    gulp.src('./fonts/generated/web.ttf').pipe(gulpSVG({
        subsettedTTF: './fonts/generated/web.ttf'
    }));
});

gulp.task('ttf2eot', function() {
    gulp.src('./fonts/generated/web.ttf').pipe(gulpEOT({
        subsettedTTF: './fonts/generated/web.ttf'
    }));
});

gulp.task('ttf2woff', function() {
    gulp.src('./fonts/generated/web.ttf').pipe(gulpWOFF({
        subsettedTTF: './fonts/generated/web.ttf'
    }));
});


gulp.task('ttf2woff2', function() {
    gulp.src('./fonts/generated/web.ttf').pipe(gulpWOFF2({
        subsettedTTF: './fonts/generated/web.ttf'
    }));
});


gulp.task('clean-fonts', function() {
    gulp.src('./fonts/generated/*.*', {
        read: false
    }).pipe(clean());
    gulp.src('./public/_common/css/fonts/*.*', {
        read: false
    }).pipe(clean());
});

gulp.task('copy-fonts', function() {
    gulp.src('./fonts/generated/*.*').pipe($copy('./public/_common/css/fonts/'));
});

gulp.task('lint', function() {
    return gulp.src('./public/_common/js/src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default', {
            verbose: true
        }))
        .pipe(jshint.reporter('fail'));
});


gulp.task('build', ['compass']);
gulp.task('watch', function() {
    gulp.watch('./public/*.html', ['font']);
    gulp.watch('./sass/**/*.scss', ['compass']);
    gulp.watch('./public/_common/js/src/**/*.js', ['lint']);
    gulp.watch('./fonts/generated/web.ttf', ['ttf2eot', 'ttf2woff', 'ttf2svg', 'ttf2otf', 'ttf2woff2', 'copy-fonts']);
});

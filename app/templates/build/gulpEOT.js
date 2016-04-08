var fs = require('fs');
var path = require('path');
var spawn = require('child_process').exec;
var through = require('through2');
var gutil = require('gulp-util');
var _ = require('lodash');
var PluginError = gutil.PluginError;


var gulpEOT = function(options) {

    var opts = _.extend({
        subsettedTTF: './fonts/generated/web.ttf'
    }, options || {});

    return through.obj(function(file, enc, callback) {
        if (file.isNull() || file.isDirectory()) {
            this.push(file);
            return callback();
        }
        processEOT(opts);
        this.push(file);
        return callback();
    });
};


var processEOT = function(options) {
    //var command = "fontforge.exe -script convert-otf.pe";
    //var command = spawn('cmd', ['/C', 'dir']);
    //var args = [];
    //args.push(options.subsettedTTF);
    var prc = spawn('ttf2eot.bat');
    prc.stdout.setEncoding('utf8');
    prc.stdout.on('data', function(data) {
        var str = data.toString();
        var lines = str.split(/(\r?\n)/g);
        console.log(lines.join(""));
    });

    prc.on('close', function(code) {
        console.log('process exit code ' + code);
    });
};

module.exports = gulpEOT;

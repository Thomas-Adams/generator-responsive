var fs = require('fs');
var path = require('path');
var htmlparser = require("htmlparser2");
var S = require('string');
var recursive = require('recursive-readdir');
var spawn = require('child_process').spawn;
var allTexts = '';
var allHtmlFiles = [];
var matchTags = [];


var isTextTag = false;
var textTagName = "";
var parser = new htmlparser.Parser({
    onopentag: function(name, attributes) {
        //console.log(name);
        for (var j = 0; j < matchTags.length; j++) {
            var obj = matchTags[j];
            //console.log(obj.attribute);
            var attrs = obj.attribute ? obj.attribute.split('=') : null;
            //console.log(attrs ? attrs[0] : "null");
            //console.log(attrs ? attrs[1] : "null");
            if (obj.tag === name) {
                //console.log('Matched tag : ' + name);
                if (attrs !== null) {
                    if (attributes && attributes[attrs[0]] === attrs[1]) {
                        //console.log('Matched attribute : ' + attrs[0] + ', ' + attributes[attrs[0]]);
                        isTextTag = true;
                        textTagName = name;
                        break;
                    }
                } else {
                    isTextTag = true;
                    textTagName = name;
                    break;
                }
            }
        }
    },
    ontext: function(text) {
        //console.log(text);
        if (text && isTextTag && !S(text).isEmpty()) {
            allTexts += S(text).replaceAll(' ', '');
            //TODO: check if we need to replace the html entities with normal characters
            //although we have set decodeEntities to true
            //console.log(text);
        }
    },
    onclosetag: function(tagname) {
        //console.log('close ' + tagname);
        if (tagname === textTagName) {
            isTextTag = false;
            textTagName = "";
        }
    }
}, {
    decodeEntities: true,
    recognizeSelfClosing: true
});


//read all .html files recursively out

//ignore all files not being html
function ignoreFiles(file, stats) {
    return path.extname(file) !== '.html';
}

recursive(__dirname + '/../public', [ignoreFiles], function(err, files) {
    if (Array.isArray(files)) {
        allHtmlFiles = files;
    } else {
        allHtmlFiles.push(files);
    }
    //console.log(allHtmlFiles.length);
    //console.log('Recursive : ' + files);

    for (var i = 0; i < allHtmlFiles.length; i++) {
        console.log('File : ' + allHtmlFiles[i]);
        var content = fs.readFileSync(allHtmlFiles[i], 'utf-8');
        parser.write(content);
        parser.end();
        allTexts = S(allTexts).replaceAll(' ', '').s;
        console.log(allTexts);
    }
    //extracting ASCII and Unicode charachters
    var allChars = extractAsciiUnicode(allTexts);

    executeFontCreation(allChars);
});



//extract all charachters ASCII and Unicode charachters from
//retrieved text for further handling with fonttools

//helper function return utf8 escape values
var unicodeEscape = function(str) {
    return str.replace(/[\s\S]/g, function(escape) {
        return '\\u' + ('0000' + escape.charCodeAt().toString(16)).slice(-4);
    });
};

//helper function, check whether a character is ASCII or not
var isAscii = function(char) {
    var c = char.charCodeAt();
    if (c < 128) return true;
    return false;
};

//helper function extract all ASCII and Unicode characters from a String
var extractAsciiUnicode = function(str) {
    var ascii = [];
    var unicode = [];
    for (var i = 0; i < str.length; i++) {
        if (isAscii(str[i]) && ascii.indexOf(str[i]) < 0)
            ascii.push(str[i]);
        else {
            var ue = unicodeEscape(str[i]);
            if (unicode.indexOf(ue) < 0)
                unicode.push(ue);
        }
    }

    return {
        "ascii": ascii,
        "unicode": unicode
    };
};



//processing with python fonttools
var executeFontCreation = function(allChars, originalFontFile, generatedFontFile) {

    var inputFontFile = originalFontFile ? originalFontFile : path.join(__dirname, '../fonts/BMWTypeChinese.ttf');
    var outputFontFile = generatedFontFile ? generatedFontFile : path.join(__dirname, '../fonts/generated/web.ttf');
    var command = "pyftsubset";
    var glyphs = allChars.ascii.length > 0 ? allChars.ascii.join(",") : "";
    var unicodes = allChars.unicode.length > 0 ? allChars.unicode.join(",") : "";
    var args = [];
    args.push(inputFontFile);
    if (glyphs.length > 0) args.push('--glyphs=' + glyphs);
    if (unicodes.length > 0) args.push('--unicodes=' + unicodes);
    args.push('--no-recommended-glyphs');
    args.push('--no-hinting');
    args.push('--ignore-missing-glyphs');
    args.push('--ignore-missing-unicodes');
    args.push('--output-file=' + outputFontFile);

    //processing the font subsetting
    var prc = spawn(command, args);
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


module.exports = function(startDirectory, optMatchTags, originalFontFile, generatedFontFile) {
    matchTags = optMatchTags;
    recursive(startDirectory, [ignoreFiles], function(err, files) {
        if (Array.isArray(files)) {
            allHtmlFiles = files;
        } else {
            allHtmlFiles.push(files);
        }
        //console.log(allHtmlFiles.length);
        //console.log('Recursive : ' + files);

        for (var i = 0; i < allHtmlFiles.length; i++) {
            console.log('File : ' + allHtmlFiles[i]);
            var content = fs.readFileSync(allHtmlFiles[i], 'utf-8');
            parser.write(content);
            parser.end();
            allTexts = S(allTexts).replaceAll(' ', '').s;
            //console.log(allTexts);
        }
        //extracting ASCII and Unicode charachters
        var allChars = extractAsciiUnicode(allTexts);

        console.log(allChars.ascii);
        console.log(allChars.unicode);
        executeFontCreation(allChars, originalFontFile, generatedFontFile);
    });
};

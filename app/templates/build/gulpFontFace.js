var css_generator = require("node-font-face-generator");
var fs = require('fs');
var path = require('path');

font_config = {
    "BMWTypeChinese": {
        "fontFamily": "BMWTypeChinese",
        "fontStyle": "normal",
        "fontWeight": "400",
        "formats": [{
            "type": "local",
            "url": "BMWTypeChinese"
        }, {
            "type": "local",
            "url": "BMWTypeChinese-Regular"
        }, {
            "type": "embedded-opentype",
            "url": "/_common/css/fonts/web.eot"
        }, {
            "type": "woff",
            "url": "/_common/css/fonts/web.woff"
        }, {
            "type": "truetype",
            "url": "/_common/css/fonts/web.ttf"
        }, {
            "type": "woff2",
            "url": "/_common/css/fonts/web.woff2"
        }, {
            "type": "opentype",
            "url": "/_common/css/fonts/web.otf"
        }, {
            "type": "svg",
            "url": "/_common/css/fonts/web.svg"
        }]
    }
};

css_generator.setup({
    fonts: font_config
});

var css = css_generator.get_font_css({
    ua: 'all',
    locale: 'zh_CN',
    fonts: ["BMWTypeChinese"]
}, function(err, css) {
    if (err) {
        console.log(err);
    } else if (css) {
        fs.writeFile("sass/fonts/fonts.scss", css, function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });

    } else {
        //should never happen
        console.log('Should never happen.');
    }
});

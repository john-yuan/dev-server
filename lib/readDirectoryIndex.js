var fs = require('fs');
var ejs = require('ejs');
var path = require('path');
var templatePath = path.resolve(__dirname, 'template/directoryIndex.ejs');
var template = fs.readFileSync(templatePath).toString();

/**
 * Read directory index
 *
 * @param {string} webroot
 * @param {string} url
 * @param {(html: string) => void} onsuccess
 * @param {(err: Error) => void} onerror
 */
var readDirectoryIndex = function (webroot, url, onsuccess, onerror) {
    var rootdir = webroot + path.sep;
    var dirname = path.resolve(webroot, './' + url.replace(/^\/+/, ''));

    // in case of the url is something like `dir/../../../etc`
    // make sure that url is subdirectory of webroot
    if (dirname.indexOf(rootdir) === 0 || webroot === dirname) {
        fs.readdir(dirname, function (err, files) {
            if (err) {
                onerror && onerror(err);
            } else {
                files.unshift('..');
                onsuccess && onsuccess(ejs.render(template, {
                    // use the relative directory name
                    dirname: url,
                    files: files
                }));
            }
        });
    } else {
        onerror && onerror(new Error('invalid directory path'));
    }
};

module.exports = readDirectoryIndex;

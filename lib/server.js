var path = require('path');
var express = require('express');
var logger = require('@john-yuan/dev-simple-logger');
var getAllIPv4Address = require('./getAllIPv4Address');
var readDirectoryIndex = require('./readDirectoryIndex');
var startServerOnAvailablePort = require('./startServerOnAvailablePort');

/**
 * @typedef {Object} ServerOptions
 * @property {string} [webroot] The web root directory. If it is a relative path, it is based on process.cwd()
 * @property {string} [index=index.html] The path of the index file. It is based on `webroot`
 * @property {string} [host=0.0.0.0] The host to listen
 * @property {number} [port=8080] The port to listen
 * @property {boolean} [tryNextPort=true] Whether to try next port (`port` + 1), if the `port` is not available
 * @property {boolean} [printAccessLog=false] Whether to print access log to console
 * @property {Object.<string, *>} [serveStaticOptions] The options passed to express.static
 */

/**
 * Start a new server
 *
 * @param {ServerOptions} options The server options
 * @param {() => void} callback The callback on server started
 * @returns {Express}
 */
var start = function (options, callback) {
    var app = express();
    var port = options.port || 8080;
    var tryNextPort = 'tryNextPort' in options ? options.tryNextPort : true;
    var index = typeof options.index === 'string' ? options.index : 'index.html';
    var host = typeof options.host === 'string' ? options.host : '0.0.0.0';
    var printAccessLog = typeof options.printAccessLog === 'boolean' ? options.printAccessLog : false;
    var webroot = path.resolve(process.cwd(), options.webroot || '');

    // set default options back
    options.webroot = webroot;
    options.tryNextPort = tryNextPort;
    options.port = port;
    options.host = host.trim();
    options.index = index;
    options.printAccessLog = printAccessLog;
    options.webroot = webroot;

    // print log to console
    if (printAccessLog) {
        app.use(function (req, res, next) {
            logger.info(req.method + ' ' + req.path);
            next();
        });
    }

    // serve static files
    app.use(express.static(webroot, options.serveStaticOptions));

    // read directory index
    app.use(function (req, res, next) {
        if (req.method.trim().toUpperCase() === 'GET') {
            readDirectoryIndex(webroot, req.url, function (html) {
                res.type('html');
                res.send(html);
            }, function (err) {
                // this function is called when failed to read directory
                next();
            });
        } else {
            next();
        }
    });

    // start server
    if (tryNextPort) {
        startServerOnAvailablePort(port, function (port) {
            return listen(options, port, app, callback);
        });
    } else {
        listen(options, port, app, callback);
    }

    return app;
};

/**
 * Listen the given port
 *
 * @param {ServerOptions} options
 * @param {number} port
 * @param {Express} app
 * @param {() => void} callback The callback on server started
 */
var listen = function (options, port, app, callback) {
    return app.listen(port, options.host, function () {
        var host = options.host;
        var webroot = options.webroot;
        var index = options.index;

        logger.info('Server Started');
        logger.info('Webroot: ' + webroot);

        if (host && host !== '0.0.0.0') {
            logger.info('Address: http://' + host + ':' + port + '/' + index);
        } else {
            logger.info('Addresses:')
            getAllIPv4Address().forEach(function (host) {
                logger.info('- http://' + host + ':' + port + '/' + index);
            });
        }

        callback && callback();
    });
};

exports.start = start;

/**
 * @param {number} port
 * @param {(port: number) => net.Server} listen
 * @param {(err: Error) => void} onerror
 */
var startServerOnAvailablePort = function (port, listen, onerror) {
    var server = listen(port);
    var handleError = err => {
        if (typeof onerror === 'function') {
            onerror(err);
        } else {
            throw err;
        }
    };

    if (server && server.once) {
        server.once('error', err => {
            if (err.code === 'EADDRINUSE') {
                startServerOnAvailablePort(port + 1, listen, onerror);
            } else {
                handleError(err);
            }
        });
    } else {
        handleError(new TypeError('listen callback must return a net.Server'));
    }
};

module.exports = startServerOnAvailablePort;

const os = require('os');

/**
 * Get all IPv4 address of this machine
 *
 * @returns {string[]} Returns an array of ip addresses
 */
const getAllIPv4Address = function () {
    let interfaces = new os.networkInterfaces();
    let hasOwn = Object.prototype.hasOwnProperty;
    let IPv4Address = [];

    for (let prop in interfaces) {
        if (hasOwn.call(interfaces, prop)) {
            for (let info of interfaces[prop]) {
                if (info.family === 'IPv4') {
                    IPv4Address.push(info.address);
                }
            }
        }
    }

    if (IPv4Address[0] !== '127.0.0.1') {
        IPv4Address.reverse();
    }

    return IPv4Address;
};

module.exports = getAllIPv4Address;

# Dev Server

A simple server based on express. Can be used to start a static file server very quick. Also support route definition.

## Install

This module is published to [NPM][NPM], you can install it with the following command:

[NPM]: https://www.npmjs.com/package/@john-yuan/dev-server

```bash
npm i @john-yuan/dev-server
```

> Note that this module is not fully tested, so keep this in mind, before you use it.

## Example

Quick start without any options:

```js
var server = require('@john-yuan/dev-server');

server.start();
```

Start with options:

```js
var server = require('@john-yuan/dev-server');

// The `server.start` method returns an instance of `Express`
var app = server.start({
    // The web root directory. If it is a relative path, it is based on process.cwd()
    webroot: 'web',
    // The path of the index file. It is based on `webroot`
    index: 'index.html',
    // The host to listen
    host: '0.0.0.0',
    // The port to listen
    port: 8080,
    // Whether to try next port (`port` + 1), if the `port` is not available
    tryNextPort: true,
    // Whether to print access log to console
    printAccessLog: false,
    // Whether to print log, defautl value is true
    printLog: true,
    // The options passed to express.static
    serveStaticOptions: null
}, function (port, hosts, webroot, options) {
    // This callback is called after the server is started
    // The parameter port is the final port the server start on
    console.log(port);
    console.log(hosts);
    console.log(webroot);
    console.log(options);
});

// You can define your extra routes here
app.get('/api/test', function (req, res) {
    res.send('This is the response of /api/test');
});
```

## Screenshot

![Bash screenshot](./screenshot.png)

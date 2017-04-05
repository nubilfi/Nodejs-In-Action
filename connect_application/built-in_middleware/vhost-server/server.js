/**
 * run with the following command:
 * $ curl -i http://testing.dev:3000
 * $ curl -i http://api.testing.dev:3000
 */

const connect = require('connect');
const http = require('http');
const vhost = require('vhost');

// main app
const server = connect();

server.use(vhost('testing.dev', function (req, res) {
    // handle req + res belongin to testing.dev
    res.setHeader('Content-Type', 'text/plain');
    res.end('hello from testing.dev\n');
}));

// an ext api server in any framework
const httpServer = http.createServer(function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('hello from the api\n');
});

server.use(vhost('api.testing.dev', function (req, res) {
    // handle req + res belonging to api.testing.dev
    // pass the request to a standard Node.js HTTP server
    httpServer.emit('request', req, res);
}));

server.listen(3000);

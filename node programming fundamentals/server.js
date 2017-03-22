const http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('hello world');
}).listen(3000);

// or with event listener
/**
 * const http require('http');
 * const server = http.createServer();
 * server.on('request', function(req, res) {
 *      res.writeHead(200, { 'Content-Type': 'text/plain' });
 *      res.end('Hello world');
 * });
 * server.listen(3000);
 */

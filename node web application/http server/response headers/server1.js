const http = require('http');
const server = http.createServer(function (req, res) {
    var body = 'Hello World';
    res.setHeader('Content-Length', body.length);
    res.setHeader('Content-Type', 'text/plain');
    res.end(body);
});
server.listen(3000);
console.log('localhost:3000');

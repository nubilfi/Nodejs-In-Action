const http = require('http');
const server = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('Hello World');
    res.end();

    // combine write() and end()
    // res.end('Hello World')
});
server.listen(3000);
console.log('localhost:3000');

const http = require('http');
const server = http.createServer(function (req, res) {
    let url = 'http://google.com';
    let body = '<p>Redirecting to <a href="' + url + '">' +
                url + '</a></p>';

    res.setHeader('Location', url);
    res.setHeader('Content-Length', body.length);
    res.setHeader('Content-Type', 'text/html');
    res.setStatusCode = 302;
    res.end(body);
});
server.listen(3000);
console.log('localhost:3000');

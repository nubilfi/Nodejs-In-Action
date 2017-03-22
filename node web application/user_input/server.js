/**
 * Rewrite previous code (restful web service)
 * To-do list User Input
 */

const http = require('http');
const qs = require('querystring');      // module to parse the body
const items = [];

function show(res) {
    let html = '<html><head><title>Todo List</title></head><body>' +
                '<h1>Todo List</h1>' +                      // For simple apps, inlining the HTML instead of using a template engine
                '<ul>' +
                items.map((item) => {
                    return '<li>' + item + '</li>';
                }).join('') +
                '</ul>' +
                '<form method="post" action="/">' +
                    '<p><input type="text" name="item"/></p>' +
                    '<p><input type="submit" value="Add Item" /></p>' +
                '</form></body></html>';
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
}

function notFound(res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not found');
}

function badRequest(res) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Bad request');
}

function add(req, res) {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => body += chunk);
    req.on('end', () => {
        let obj = qs.parse(body);
        items.push(obj.item);
        show(res);
    });
}

const server = http.createServer(function (req, res) {
    if ('/' == req.url) {
        switch (req.method) {
            case 'GET':
                show(res);                  // handler function show()
                break;
            case 'POST':
                add(req, res);              // handler function add()
                break;
            default:
                badRequest(res);            // Any HTTP vers that is not GET or POST is a 400 Bad Request response
        }
    } else {
        notFound(res);                      // URL that's not exactly '/' is a 404 not found response
    }
});
server.listen(3000);

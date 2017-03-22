var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res) {
    getTitles(res);
}).listen(3000, "127.0.0.1");

function getTitles(res) {                                   // instead of creating an else branch, you return, 
    fs.readFile('./titles.json', function(err, data) {      // because if an error occurred you don't need to continue executing this function
        if(err) return hadError(err, res);
        getTemplate(JSON.parse(data.toString()), res);
    });
}

function getTemplate(titles, res) {
    fs.readFile('./template.html', function(err, data) {
        if(err) return hadError(err, res);
        formatHtml(titles, data.toString(), res);
    });
}

function formatHtml(titles, tmpl, res) {
    var html = tmpl.replace('%', titles.join('</li><li>'));
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
}

function hadError(err, res) {
    console.error(err);
    res.end('Server Error');
}
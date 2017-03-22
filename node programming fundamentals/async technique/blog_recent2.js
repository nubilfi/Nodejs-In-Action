var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res) {     // client request initially comes in here
    getTitles(res);     // control is passed to getTitles
}).listen(3000, "127.0.0.1");

function getTitles(res) {       // getTitles pull titles and passes control to getTemplate
    fs.readFile('./titles.json', function(err, data) {
        if(err) {
            hadError(err);
        } else {
            getTemplate(JSON.parse(data.toString()), res);
        }
    });
}

function getTemplate(titles, res) {     // getTemplate reads template file and passes control to formatHtml
    fs.readFile('./template.html', function(err, data) {
        if(err) {
            hadError(err);
        } else {
            formatHtml(titles, data.toString(), res);
        }
    });
}

function formatHtml(titles, tmpl, res) {        // formatHtml takes titles and tempalte, and renders a response back to client
    var html = tmpl.replace('%', titles.join('</li><li>'));
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
}

function hadError(err, res) {       // if an error occurs along the way, hadError logs error to console and responds to client with 'Server Error'
    console.error(err);
    res.end('Server Error');
}
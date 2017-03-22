var http = require('http');
var fs = require('fs');

http.createServer(function(req, res) {      // create http server and use callback to define response login
    if(req.url == '/') {
        fs.readFile('./titles.json', function(err, data) {       // read JSON file and use callback to define what to do with its contents
            if(err) {       // if error occurs, log error and return "server error" to client
                console.error(err);
                res.end('Server Error');
            } else {
                var titles = JSON.parse(data.toString());       // parse data from JSON text

                fs.readFile('./template.html', function(err, data) {        // read HTML template and use callback when it's loaded
                    if(err) {
                        console.error(err);
                        res.end('Server Error');
                    } else {
                        var tmpl = data.toString();

                        var html = tmpl.replace('%', titles.join('</li><li>'));     // assemble HTML page showing blog titles
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(html);     // send HTML page to user
                    }
                });
            }
        });
    }
}).listen(3000, "127.0.0.1");
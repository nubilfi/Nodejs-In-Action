var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var chatServer = require('./lib/chat_server');
var cache = {};

// helper function for handling 404 errors
function send404(response) {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: resource not found.');
    response.end();
}

// helper function serves file data
function sendFile(response, filePath, fileContents) {
    response.writeHead(
        200,
        {'content-type': mime.lookup(path.basename(filePath))}
    );
    response.end(fileContents);
}

// helper function to Serve static files
function serveStatic(response, cache, absPath) {
    // check if file is cached in memory
    if(cache[absPath]) {
        sendFile(response, absPath, cache[absPath]); // serve file from memory
    } else {
        fs.exists(absPath, function (exists) {  // check if file exists
            if(exists) {
                fs.readFile(absPath, function (err, data) {  // read file from disk
                    if(err) {
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data); // serve file read from disk
                    }
                });  
            } else {
                send404(response);
            }
        });
    }
}

var server = http.createServer(function (request, response) {
    var filePath = false;

    if(request.url == '/') {
        filePath = 'public/index.html'; // determine HTML file to be serverd by default
    } else {
        filePath = 'public' + request.url; // translate URL path to relative file path
    }

    var absPath = './' + filePath;
    serveStatic(response, cache, absPath);  // serve static file
});

server.listen(3000, function () {
    console.log('Server listening on port 3000');
});

chatServer.listen(server);
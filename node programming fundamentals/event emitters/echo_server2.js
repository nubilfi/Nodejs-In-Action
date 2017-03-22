/**
 * Using once method to respond
 * to a single event
 */
var net = require('net');

var server = net.createServer(function(socket) {
    socket.once('data', function(data) {      // data events handled whenever new data as been read
        socket.write(data);                 // data event will only be handled once
    });
});

server.listen(3000);

/**
 * after run this file with command "node filename.js"
 * type the following command in new terminal:
 * telnet 127.0.0.1 3000
 */
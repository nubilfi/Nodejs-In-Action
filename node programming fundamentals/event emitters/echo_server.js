var net = require('net');

var server = net.createServer(function(socket) {
    socket.on('data', function(data) {      // data events handled whenever new data as been read
        socket.write(data);                 // data is written (echoed back) to client
    });
});

server.listen(3000);

/**
 * after run this file with command "node filename.js"
 * type the following command in new terminal:
 * telnet 127.0.0.1 3000
 */
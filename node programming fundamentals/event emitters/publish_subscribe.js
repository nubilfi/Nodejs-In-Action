var events = require('events');
var net = require('net');

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};
channel.setMaxListeners(50);

channel.on('join', function(id, client) {
    var welcome = "Welcome!\n" +
                'Guests online: ' + this.listeners('broadcast').length;
    this.clients[id] = client;      // add a listener for the join event that stores a user's client object, allowint the application to send data back to the user.
    this.subscriptions[id] = function(senderId, message) {
        if(id != senderId) {        // ignore data if it's been directly broadcast by the user.
            this.clients[id].write(message);
        }
    };
    this.on('broadcast', this.subscriptions[id]);    // add a listener, specific to the current user, for the broadcast event.
});

channel.on('leave', function(id) {      // Create listener for leave event
    channel.removeListener('broadcast', this.subscriptions[id]);
    channel.emit('broadcast', id, id + " has left the chat.\n");    // remove broadcast listner for specific client
});

var server = net.createServer(function(client) {
    var id = client.remoteAddress + ':' + client.remotePort;
    client.on('connect', function() {
        channel.emit('join', id, client);       // emit a join event when a user connects to the server, specifying the user ID and client object
    });
    client.on('data', function(data) {
        data = data.toString();
        if(data == "shutdown\r\n") {
            channel.emit('shutdown');
        }
        channel.emit('broadcast', id, data);    // emit a channel broadcast event, specifying the user ID and message, when any user sends data.
    });
    channel.on('close', function() {
        channel.emit('leave', id);              // Emit leave event when client disconnects
    });
    channel.on('shutdown', function() {
        channel.emit('broadcast', '', "Chat has shut down.\n");
        channel.removeAllListeners('broadcast');
    });
});

server.listen(3000);

/**
 * after run this file with command "node filename.js"
 * type the following command in new terminal:
 * telnet 127.0.0.1 3000
 */

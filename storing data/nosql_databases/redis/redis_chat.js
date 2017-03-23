/**
 * Simple chat server implemented with
 * Redis pub/sub functionality
 */

const net = require('net');
const redis = require('redis');

const server = net.createServer(function (socket) {       // define setup login for each user connecting to chat server
    let subscriber;
    let publisher;

    socket.on('connect', () => {
        subscriber = redis.createClient();          // create subscriber client for each user
        subscriber.subscribe('main_chat_room');     // subscribe to a channel
    });

    publisher = redis.createClient();               // create publisher client for each user

    socket.on('data', (data) => {
        publisher.publish('main_chat_room', data);      // when user enters a message, publish it
    });

    socket.on('end', () => {
        subscriber.unsubscribe('main_chat_room');       // if user disconnects, end client connections
        subscriber.end();
        publisher.end();
    });
});

server.listen(3000);                // start chat server

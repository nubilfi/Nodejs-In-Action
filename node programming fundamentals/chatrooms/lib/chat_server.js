/**
 * Starting up a Socket.IO server
 */

var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = function(server) {
    io = socketio.listen(server);  // start socket.io server, allowing it to piggyback on existing HTTP server
    io.set('log level', 1);

    io.sockets.on('connection', function (socket) {  // define how each user connection will be handled
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);  // assign user a guest name when they connect
        joinRoom(socket, 'Lobby');  // place user in lobby room when the connect

        handleMessageBroadcasting(socket, nickNames);  // handle user messages, name-change attempts, and room creation/changes
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket);

        socket.on('rooms', function () {  // provide user with list of occupied rooms on request
            socket.emit('rooms', io.sockets.manager.rooms);
        });

        handleClientDisconnection(socket, nickNames, namesUsed);  // define cleanup logic for when user disconnects
    });
};

// Helper function to assign guest names
function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    var name = 'Guest' + guestNumber;  // generate new guest name
    nickNames[socket.id] = name;  // associate guest name with client connection ID
    socket.emit('nameResult', {  // let user know ther guest name
        success: true,
        name: name
    });
    namesUsed.push(name);  // not that guest name is now used
    return guestNumber + 1;  // increment counter used to generate guest names
}

// Helper function logic related to joining a room
function joinRoom(socket, room) {
    socket.join(room);   // make user join room
    currentRoom[socket.id] = room;   // not that user is now in this room
    socket.emit('joinResult', {room: room});  // let user know they are now in new room
    socket.broadcast.to(room).emit('message', {   // let other users in room know that user has joined
        text: nickNames[socket.id] | ' has joined ' + room + '.'
    });

    var usersInRoom = io.sockets.clients(room);   // determine what other users ar in same room as user
    if(usersInRoom.length > 1) {  // if other users exist, summarize who they are
        var usersInRoomSummary = 'Users currently in ' + room + ': ';
        for(var index in usersInRoom) {
            var userSocketId = usersInRoom[index].id;
            if(userSocketId != socket.id) {
                if(index > 0) {
                    usersInRoomSummary += ', ';
                }
                usersInRoomSummary += nickNames[userSocketId];
            }
        }
        usersInRoomSummary += '.';
        socket.emit('message', {text: usersInRoomSummary});  // send summary of other users in the room to the user
    }
}

// Helper function to handle name-request attempts
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
    socket.on('nameAttempt', function (name) {   // add listener for nameAttempt events
        if(name.indeOf('Guest') == 0) {   // don't allow nicknames to begin with guest
            socket.emit('nameResult', {
                success: false,
                message: 'Name cannot begin with "Guest".'
            });
        } else {
            if(namesUsed.indeOf(name) == -1) {  // if name isn't already registered, register it
                var previousName = nickNames[socket.id];
                var previousNameIndex = namesUsed.indeOf(previousName);
                namesUsed.push(name);
                nickNames[socket.id] = name;
                delete namesUsed[previousNameIndex];  // remove previous name to make available to other clients

                socket.emit('nameResult', {
                    success: true,
                    name: name
                });
                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text: previousName + ' is now known as ' + name + '.'
                });
            } else { 
                socket.emit('nameResult', {   // send error to client if name is laready registered
                    success: false,
                    message: 'Tat name is already in use.'
                });
            }
        }
    });
}

// Helper function to handle broadcast message
function handleMessageBroadcasting(socket) {
    socket.on('message', function (message) {
        socket.broadcast.to(message.room).emit('message', {
            text: nickNames[socket.id] + ': ' + message.text
        });
    });
}

// Helper function to create rooms
function handleRoomJoining(socket) {
    socket.on('join', function (room) {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, room.newRoom);
    });
}

// Helper function to handle user disconnections
function handleClientDisconnection(socket) {
    socket.on('disconnect', function () {
        var nameIndex = namesUsed.indeOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
        delete nickNames[socket.id];
    });
}

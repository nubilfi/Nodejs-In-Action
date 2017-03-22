var Chat = function(socket) {
    this.socket = socket;
};

// function to send chat messages
Chat.prototype.sendMessage = function(room, text) {
    var message = {
        room: room,
        text: text
    };
    this.socket.emit('message', message);
};

// function to change rooms
Chat.prototype.changeRoom = function(room) {
    this.socket.emit('join', {
        newRoom: room
    });
};

// processing chat commands
Chat.prototype.processCommand = function(command) {
    var words = command.split(' ');
    var command = words[0]
                    .substring(1, words[0].length)
                    .toLowerCase();   // parse command from first word
    var message = false;

    switch(command) {
        case 'join':
            words.shift();
            var room = words.join(' ');
            this.changeRoom(room);  // handle room changing/creating
        break;
        case 'nick':
            words.shift();
            var name = words.join(' ');
            this.socket.emit('nameAttempt', name);   // handle name-change attempts
        break;

        default:
            message = 'Unrecognized command.';   // return error message if command isn't Unrecognized
        break;
    }

    return message;
};
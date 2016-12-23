// Node modules
const express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    colors = require('colors');

// Game modules
const Player = require('./server/player.js'),
    Lobby = require('./server/lobby.js')(),
    Tools = require('./server/tools.js');

const players = [];

const message_history = [];

function debug(message, color = 'blue') {
    console.log('[' + (new Date()) + '] ' + colors[color](message));
}

// Serve files from public directory
app.use(express.static('public'));

// Socket IO connections
io.on('connection', (socket) => {
    // Create a player from the connection.
    let player = new Player(socket.id);

    // Add the player to the player list.
    players.push(player);

    // Log the new connection
    debug('Connection: ' + [player.name, socket.id, socket.handshake.address].join(' - ') + ' (' + players.length + ' players)', 'yellow');

    // Tell everyone about the new player
    io.emit('enter', player.details());

    // Add lobby messages
    if (message_history.length)
        message_history.forEach((message) => io.emit('lobby message', message));

    // Update the player with all rooms/players
    socket.emit('update', {
        rooms: Lobby.rooms(),
        player: player.details(),
        players: players.map((p) => p.details())
    });

    // Player wants a manual server update
    socket.on('update', () => {
        socket.emit('update', {
            rooms: Lobby.rooms(),
            player: player.details(),
            players: players.map((p) => p.details())
        });
    });


    // Player wants to join a room
    socket.on('join', (room_id) => {
        let room = Lobby.room(room_id);

        if ( ! room ) {
            return socket.emit('notice', 'Invalid room.');
        }

        Lobby.partAll(player);
        room.join(player);
        socket.join(room.id);

        debug(player.name + ' joined ' + room.name, 'red');

        io.emit('join', {
            player: player.details(),
            room: room.details()
        });
    });

    // Player wants to leave a room
    socket.on('part', (room_id) => {
        let room = Lobby.room(room_id);

        if (! room || !room.hasPlayer(player)) {
            return socket.emit('notice', 'Invalid room.');
        }

        room.part(player);
        socket.leave(room.id);

        debug(player.name + ' parted ' + room.name, 'red');

        io.emit('part', {
            player: player.details(),
            room: room.details()
        });
    });

    // Player wants to rename themselves
    socket.on('rename', (new_name) => {
        if (new_name.length < 5) {
            return socket.emit('notice', 'Name is too short.');
        }

        if (! new_name.match(/^[a-z0-9]+$/i)) {
            return socket.emit('notice', 'Name contains invalid characters.');
        }

        debug(player.name + ' changed name to ' + new_name, 'red');

        player.rename(new_name);
        io.emit('rename', player.details());
    });

    // Player sends a chat message
    socket.on('lobby message', (message) => {
        debug('(' + player.name + ') ' + message, 'green');

        message = {
            player: player,
            message: message
        };

        io.emit('lobby message', message);
        message_history.push(message);

        if (message_history.length >= 20) {
            message_history.shift();
        }
    });

    // Player sends a chat message
    socket.on('room message', (data) => {
        if (! ('room' in data && 'message' in data))
        {
            return socket.emit('notice', 'Invalid message object sent.');
        }

        let room = Lobby.room(data.room);

        if (! room || !room.hasPlayer(player))
        {
            return socket.emit('notice', 'Invalid room message sent.');
        }

        debug('(' + player.name + '#'+ room.name + ') ' + message, 'green');

        io.to(room.id).emit('room message', {
            player: player,
            message: data.message
        });
    });

    // Player disconnected
    socket.on('disconnect', () => {
        players.splice(players.indexOf(player), 1);
        Lobby.partAll(player);
        io.emit('exit', player.details());

        debug('Disconnect: ' + [player.name, socket.id, socket.handshake.address].join(' - ') + ' (' + players.length + ' players)', 'yellow');
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});

var socket = require('socket.io-client')('http://localhost:3000');

var events = [
    'connect',
    'disconnect',
    'enter', // new player in lobby
    'exit', // player left lobby
    'update', // random update data
    'notice', // error notice
    'join', // player joined room
    'part', // player left room
    'rename', // player has new name
    'lobby message', // new lobby message
    'room message', // new room message
];

events.forEach((event) => {
    socket.on(event, (...args) => {
        args.unshift(event);
        console.log.call(this, args);
    });
});

socket.on('update', (data) => {
    socket.emit('join', data.rooms[0].id);
});

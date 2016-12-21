const Room = require('./room.js');

class Lobby {
    constructor(number_of_rooms = 5) {
        this._rooms = [];

        // Create all of the rooms
        for(var i = 1; i < number_of_rooms; i++) {
            this._rooms.push(new Room('room-' + i, 'Room ' + i));
        }
    }

    // Remove a user from any rooms, should only be in a single room.
    partAll(player) {
        let room = this._rooms.find((room) => room.hasPlayer(player));
        if (room) {
            room.part(player);
        }
    }

    // Find a room by ID in the lobby
    room(room_id) {
        return this._rooms.find((room) => room.id === room_id);
    }

    // Return all rooms
    rooms() {
        return this._rooms.map((room) => room.details());
    }

}

module.exports = function(...args) {
    return new Lobby(...args);
};

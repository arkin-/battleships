class Room {

    constructor(id, name) {
        this.id = id;
        this.name = name;

        this.current_players = 0;
        this.max_players = 2;
        this._players = [];
    }

    join(player) {
        this._players.push(player);
        this.current_players = this._players.length;
    }

    part(player) {
        this._players.splice(player, 1);
        this.current_players = this._players.length;
    }

    hasPlayer(player) {
        return this._players.includes(player);
    }

    details() {
        return {
            id: this.id,
            name: this.name,
            current_players: this.current_players,
            max_players: this.max_players,
            players: this._players.map((p) => p.name)
        };
    }
}

module.exports = Room;

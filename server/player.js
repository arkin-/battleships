class Player {
    constructor(id) {
        this.id = id;
        this.name = 'Guest ' + Math.ceil(Math.random() * 89999 + 10000);
    }

    rename(name) {
        this.name = name;
    }

    details() {
        return {
            id: this.id,
            name: this.name
        };
    }
}

module.exports = Player;

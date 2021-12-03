const { log } = require('../classes/Logger.js');

class Mafia {
    constructor (client, players, guild) {
        this.crossPlayer = players[0];
        this.zeroPlayer = players[1];

        this.dateTime = new Date();
        this.guild = guild;

        this.crossPlayerSteps = [];
        this.zeroPlayerSteps = [];
        this.completed = false;
        this.field = [['#', '#', '#'], ['#', '#', '#'], ['#', '#', '#']];
        this.chars = ['X', 'O'];
        this.emojis = ['1️⃣', '2️⃣', '3️⃣', '🛑']
        this.index = client.games['ticTacToe'].length;
        client.games['ticTacToe'].push(this);

        this.start();
    }
}

module.exports = Mafia;
const {log} = require('../classes/Logger.js')

class Game {
    constructor(client, game, channel){
        this.client = client;
        this.game = game;
        this.channel = channel;
        this.index = client.games.length;
        client.games[game].push(this);
    }

    async delete () {
        this.client.games[this.game].splice(this.index, this.index);
        //await this.channel.delete();
        log('Успішно видалено')
    }
}

module.exports = Game;
const {log} = require('../classes/Logger.js');
const CommandBook = require('../classes/books/CommandBook.js');

class GameQueue {
    constructor(client, game, message, enough) {
        this.client = client;
        this.game = game;
        this.message = message;
        this.GameClass = require(`../games/${game.slice(0, 1).toUpperCase()}${game.slice(1)}`);
        this.initiator = message.author;
        this.enough = enough;
        this.amount = 1;
        this.players = [];
        this.players.push(this.initiator);
        this.index = client.gameQueues.length;
        client.gameQueues[game].push(this);
        let name;
        switch (game) {
            case 'ticTacToe':
                name = 'Хрестики-нулики'
                break;
        }

        this.commandBook = new CommandBook(client, message.channelId, message.channel, `Черга гри в ${game}`, '1️⃣ - приєднатись до гри')
        this.commandBook.functions.push((user) => {
            log(user.id)
            this.players.forEach(player => {
                if(user.id == player.id) {
                    log(`${user.id} ${player.id}`)

                    return;
                }
                this.commandBook.channel.send({embeds: [{
                    description: `${user} Приєднався до гри в ${this.game}`
                }]})
                this.amount++;
                this.players.push(user)
                if(this.amount == this.enough){
                    log('Готово!')
                    this.startGame()
                } 
            })
                   
        })
        this.commandBook.start();
    }

    async delete() {
        this.client.gameQueues.splice(this.index, this.index);
        //this.commandBook.delete()
    }

    startGame () {
        new this.GameClass(this.client, this.players, this.message.guild);
        this.delete();
    }
}

module.exports = GameQueue;
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
        client.gameQueues.push(this);

        this.commandBook = new CommandBook(client, message.channelId, message.channel, `Черга гри в ${game}`, `1️⃣ - приєднатись до гри\nГравців в черзі: ${this.amount}\nДля початку потрібно: ${this.enough}`)
        this.commandBook.functions.push(async (user) => {

            let excluse = true;
            this.players.forEach(player => {
                if(user.id == player.id) {
                    log(`${user.id} ${player.id}`)
                   //excluse = false
                   //return;
                }
            })   
            if(excluse){
                this.players.push(user);
                this.amount++;
                this.commandBook.channel.send({embeds: [{
                    description: `${user} Приєднався до гри в ${this.game}`
                }]})
                this.commandBook.message.edit({embeds: [{
                    title: `Черга гри в ${game}`,
                    description: `1️⃣ - приєднатись до гри\nГравців в черзі: ${this.amount}\nДля початку потрібно: ${this.enough}`
                }]})    
                if(this.amount == this.enough){
                    log('Готово!')
                    await this.startGame()
                } 
            }
            
            
            
            
            
            
                   
        })
        this.commandBook.start();
    }

    async delete() {
        log(this.message)
        await this.commandBook.delete();
        this.client.gameQueues.splice(this.index, this.index);
        //this.commandBook.delete()
    }

    async startGame () {
        new this.GameClass(this.client, this.players, this.message.guild);
        await this.delete();
    }
}

module.exports = GameQueue;
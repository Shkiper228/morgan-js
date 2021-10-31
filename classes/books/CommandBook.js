const {MessageEmbed} = require('discord.js');
const fs = require('fs');
const {log} = require('../Logger.js');
const Book = require('./Book.js');


class CommandBook extends Book {
    constructor (client, channel_id, channel, name, text) {
        super(client, channel_id);
        this.channel = channel;
        this.name = name;
        this.description = text;
        this.functions = [];

        client.commandBooks.push(this);
    }

    async start () {
        this.message = await this.channel.send({embeds: [{
            title: this.name,
            description: this.description
        }]})

        for(let i = 0; i < this.functions.length; i++) {
            this.message.react(this.emojis[i]);
        }
    }

    async delete() {
        this.client.commandBooks.splice(this.index, this.index);
        this.message.delete();
    }
}

module.exports = CommandBook;
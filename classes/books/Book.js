const {MessageEmbed} = require('discord.js')
const { log } = require('../Logger.js')
const fs = require('fs');
const config = require('../../config/config.json')


class Book {
    constructor (client, channel_id) {
        this.client = client;

        this.channel_id = channel_id;
    }
    emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '0️⃣'];
}

module.exports = Book;
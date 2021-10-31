const { MessageActionRow, MessageEmbed} = require('discord.js');
const TicTacToe = require('../games/TicTacToe.js')
const GameQueue = require('../games/GameQueue.js')
const CommandBook = require('../classes/books/CommandBook.js');
const Command = require('../classes/Command.js');
const {log} = require('../classes/Logger.js');
const Game = require('../games/Game.js');

const games = new Command(client, {
    name: 'games',
    description: 'Команда для простого створення кімнат з іграми',
    ownerOnly: false,
    adminOnly: false
}, async (client, message, args) => {
    const channel = message.channel;
    const channel_id = message.channelId;
    const book = new CommandBook(client, channel_id, channel, 'Ігри', '1️⃣ - Хрестики-нулики (необхідно 2 гравця)', false);
    book.functions.push(async (user) => {
        if(user.bot) return;
        new GameQueue(client, 'ticTacToe', message, 2);
    })
    book.start();
})

module.exports = games;
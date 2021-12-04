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
    const book = new CommandBook(client, channel_id, channel, 'Ігри', '1️⃣ - Хрестики-нулики (необхідно 2 гравця)\n2️⃣ - Мафія (необхідно від 5-и гравців)', false);
    book.functions.push(async (user) => {
        if(user.bot) return;
        new GameQueue(client, 'ticTacToe', message, 2);
    });
    book.functions.push(async (user) => {
        if(user.bot) return;
        const optionBook = new CommandBook(client, channel_id, channel, 'Установіть кількість гравців', '1️⃣ - добавити\n2️⃣ - відняти\n3️⃣ - підтвердити\nКількість гравців: 0')
        optionBook.players = 0;
        optionBook.functions.push(async (user) => {
            optionBook.players++;
        });
        optionBook.functions.push(async (user) => {
            optionBook.players--;
        });
        optionBook.functions.push(async (user) => {
            if(optionBook<6) {
                await message.channel.send(`${user} недостатньо гравців`);
                return;
            }
            new GameQueue(client, 'mafia', message, optionBook.players);
            optionBook.delete();
        });
        
    });
    book.start();
})

module.exports = games;
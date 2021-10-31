const Game = require('../games/Game.js');
const fs = require('fs')
const Command = require('../classes/Command.js');
const {log} = require('../classes/Logger.js');

const test = new Command(client, {
    name: 'test',
    description: 'Тестова команда. Лише для розробника',
    ownerOnly: false,
    adminOnly: false
}, async (client, message, args) => {

    log(`Кількість ігор - ${client.games['ticTacToe'].length}`);

    log(client.games['ticTacToe'][0].game);
})

module.exports = test;
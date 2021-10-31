const { MessageActionRow } = require('discord.js');
const fs = require('fs')
const Command = require('../classes/Command.js');
const {log} = require('../classes/Logger.js')

const test = new Command(client, {
    name: 'test',
    description: 'Тестова команда. Лише для розробника',
    ownerOnly: true,
    adminOnly: false
}, async (client, message, args) => {
    log(`${message.member.roles.highest} найвища роль`)

    if (message.member.roles.highest.toString() === '@everyone') {
        log('Учасник немає ролей!', 'warning')
    }

    fs.readFile('1.txt', (err, data) => {
        if (err) throw err;
        message.channel.send(data.toString())
    })
})

module.exports = test;
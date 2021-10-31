const { MessageActionRow, MessageEmbed} = require('discord.js');
const Command = require('../classes/Command.js');
const {log} = require('../classes/Logger.js')
const config = require('../config/config.json')

const link = new Command(client, {
    name: 'link',
    description: 'Видає основне запрошення на сервер',
    ownerOnly: false,
    adminOnly: false
}, async (client, message, args) => {
    message.channel.send(`${config.main_link}`)
})

module.exports = link;
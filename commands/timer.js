const { MessageActionRow, MessageEmbed} = require('discord.js');
const Command = require('../classes/Command.js');
const {log} = require('../classes/Logger.js')
const config = require('../config/config.json')

const timer = new Command(client, {
    name: 'timer',
    description: 'Створює таймер на указаний час у хвилинах',
    ownerOnly: false,
    adminOnly: false
}, async (client, message, args) => {
    args[0] = Number(args[0]);
    log(typeof args[0])
    if (typeof args[0] != 'number') {
        await message.channel.send({embeds: [{
            description: `${message.member} потрібно вказати ціле число`
        }]})
        return;
    }
    time = args[0] * 60 * 1000;

    if (args[1]) {
        message.channel.send({embeds: [{
            description: `Створено таймер на ${args[0]} хвилин, під назвою ${args[1]}`
        }]})
    } else {
        message.channel.send({embeds: [{
            description: `Створено таймер на ${args[0]} хвилин`
        }]})
    }

    //message.channel.send()



    setTimeout(() => {
        message.channel.send({embeds: [{
            description: `${message.member} твій таймер на ${args[0]} хвилин спрацював!`
        }]})
    }, time)
})

module.exports = timer;
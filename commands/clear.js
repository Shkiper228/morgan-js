const { MessageActionRow } = require('discord.js');
const Command = require('../classes/Command.js');
const {log} = require('../classes/Logger.js')

const clear = new Command(client, {
    name: 'clear',
    description: 'Команда для очистки чату. Лише для адміністрації',
    ownerOnly: true,
    adminOnly: false
}, async (client, message, args) => {
    message.channel.bulkDelete(Number(args[0]) + 1)
        .then(messages => log(`Видалено ${messages.size - 1} повідомлень`))
    
})

module.exports = clear;
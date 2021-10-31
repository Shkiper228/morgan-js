const { MessageActionRow } = require('discord.js');
const Command = require('../classes/Command.js');
const {log} = require('../classes/Logger.js')

const info = new Command(client, {
    name: 'info',
    description: 'Деяка загальна інформація про сервер',
    ownerOnly: false,
    adminOnly: false
}, async (client, message, args) => {
    guild = message.guild;
    owner = await guild.fetchOwner()
    onlineMembers = 0

   


    await message.channel.send({embeds: [{
        title: 'ЗАГАЛЬНА ІНФОРМАЦІЯ ПРО СЕРВЕР',
        description:   `Назва: ${guild.name}\n
                        Було створено: ${formatDateTime(guild.createdAt)}\n
                        Творець сервера: ${owner}\n
                        Людей на сервері: ${guild.memberCount} ⚫️\n`

    }]})
})


function formatDateTime(date) {
    const days = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
    const months = date.getMonth() < 10 ? `0${date.getMonth()}` : `${date.getMonth()}`;

    const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`;
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;

    return `${days}.${months}.${date.getFullYear()} ${hours}:${minutes}:${seconds}`;
    
}

module.exports = info;
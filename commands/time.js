const { MessageActionRow } = require('discord.js');
const Command = require('../classes/Command.js');
const {log} = require('../classes/Logger.js')
const TimeShift = require('timeshift-js');

function formatCurrentTime() {
    const date = new Date();
    //date.setHours(date.getHours + 3);

    const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`;
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;

    return `${hours}:${minutes}:${seconds}`;
}

const time = new Command(client, {
    name: 'time',
    description: 'Показує дійсний місцевий час',
    ownerOnly: false,
    adminOnly: false
}, async (client, message, args) => {
    await message.channel.send({embeds: [{description: `${message.author} дійсний час --> ${formatCurrentTime()}`}]})
})

module.exports = time;
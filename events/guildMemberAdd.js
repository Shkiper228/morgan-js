const Event = require('../classes/Event.js');
const channels = require('../config/channels.json')
const { log } = require('../classes/Logger.js');

function formatCurrentDateTime() {
    const date = new Date();
    const days = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
    const months = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth()+ 1}`;

    const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`;
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;

    return `${days}.${months}.${date.getFullYear()} ${hours}:${minutes}:${seconds}`;
}

const guildMemberAdd = new Event(client, async (member) => {
    const channel = await member.guild.channels.fetch(client.config_channels.users);

    channel.send({embeds: [{
        description: `Ласкаво просимо на сервері, ${member}! Ти уже ${member.guild.memberCount}-й\n`
    }]});

    /*channel.send({embeds: [{
        description: `Ласкаво просимо на сервері, ${member}! Ти уже ${member.guild.memberCount}-й\nПрочитай правила ${}`
    }]})*/
});

module.exports = guildMemberAdd;
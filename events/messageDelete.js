const Event = require('../classes/Event.js');
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

const messageDelete = new Event(client, async (message) => {
    const channel = await message.guild.channels.fetch(client.config_channels.deleted_messages);
    channel.send({embeds: [{
        fields: [{
            name: 'Автор і час',
            value: `${message.author} id: ${message.author.id}\n${formatCurrentDateTime()}`
        },
        {
            name: 'Канал',
            value: `${message.channel.name}`
        },
        {
            name: 'Вміст',
            value: `${message}`
        }
        ]
    }]});
});

module.exports = messageDelete;
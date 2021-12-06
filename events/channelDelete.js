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

const channelDelete = new Event(client, async (channel) => {
    const channelDeleted = await channel.guild.channels.fetch(client.config_channels.channel_delete);

    if(!channel.parent)
    channelDeleted.send({embeds: [{
        fields: [{
            name: 'Автор і час',
            value: `${channel.client.user} id: ${channel.client.user.id}\n${formatCurrentDateTime()}`
        },
        {
            name: 'Назва видаленого каналу, тип і категорія',
            value: `Назва: \`${channel.name}\`\nТип: \`${channel.type}\`\nКатегорія: \`${!channel.parent ? 'GLOBAL' : channel.parent.name}\``
        }
        ]
    }]});
});

module.exports = channelDelete;
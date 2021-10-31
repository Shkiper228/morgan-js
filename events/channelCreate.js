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

const channelCreate = new Event(client, async (channelCreated) => {
    const channel = await channelCreated.guild.channels.fetch(client.config_channels.channel_create);

    log(channelCreated);
    channel.send({embeds: [{
        fields: [{
            name: 'Автор і час',
            value: `${channelCreated.client.user} id: ${channelCreated.client.user.id}\n${formatCurrentDateTime()}`
        },
        {
            name: 'Назва створеного каналу, тип і категорія',
            value: `Назва: \`${channelCreated.name}\`\nТип: \`${channelCreated.type}\`\nКатегорія: \`${channelCreated.parent ? channelCreated.parent.name : 'undefined'}\``
        }
        ]
    }]});
});

module.exports = channelCreate;
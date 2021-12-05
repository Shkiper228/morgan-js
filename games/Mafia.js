const { log } = require('../classes/Logger.js');

class Player {
    constructor (member, role, personal_channel) {
        this.member = member;
        this.role = role;
        this.personale_channel;

        this.isDead = false;

        this.votes = [];
        this.moves = [];
        
    }
}
class Mafia {
    constructor (client, players, guild) {
        this.players = players;
        this.guild = guild;
        this.author = players[0];


        this.dateTime = new Date();
        
        
        this.index = client.games['mafia'].length;
        client.games['mafia'].push(this);


        this.emojis = ['🛑'];
        this.number_emoji = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
        this.channels = [];
        this.nigth = 0;
        this.completed = false;

        this.init();
    }

    async init() {
        this.category = await this.guild.channels.create(`Mafia#${this.index + 1}`, {
            type: 'GUILD_CATEGORY',
            reason: `Категорія для гри в мафію №${this.index}`,
            permissionOverwrites: [{
                id: this.guild.id,
                deny: 'VIEW_CHANNEL'
            }]
        })
        this.players.forEach(async player => {
            this.category.permissionOverwrites.create(player, {'SEND_MESSAGES': true, 'VIEW_CHANNEL': true})
            const channel = await this.category.createChannel(`${player.username}`, {
                reason: `Приватний канал для гравця ${player.username}`,
                permissionOverwrites: [{
                    id: player.id,
                    allow: 'VIEW_CHANNEL'
                },
                {
                    id: player.id,
                    allow: 'SEND_MESSAGES'
                }]
            })
            this.channels.push(channel);
        });
    }














}

module.exports = Mafia;
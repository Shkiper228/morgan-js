const Game = require('../games/Game.js');
const { log } = require('../classes/Logger.js');
const mafiaConfig = require('../config/games_rules.json').mafia;

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
class Mafia extends Game {
    constructor (client, players, guild) {
        super(client, 'mafia');
        this.client = client;
        this.users = players;
        this.guild = guild;
        this.author = players[0];


        this.dateTime = new Date();
        
        this.players_amount = players.length;
        this.players_live_amount = players.length;
        this.roles = mafiaConfig.roles;


        this.emojis = ['🛑'];
        this.number_emoji = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
        this.channels = [];
        this.sequence = [];
        this.random_numbers = [];
        this.players = [];
        this.nigth = 0;
        this.completed = false;
        this.winner = '';
        this.players_markup


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
        this.users.forEach(async user => {
            this.category.permissionOverwrites.create(user, {'SEND_MESSAGES': true, 'VIEW_CHANNEL': true})
            const channel = await this.guild.channels.create(`${user.username}`, {
                reason: `Приватний канал для гравця ${user.username}`,
                parent: this.category,
                permissionOverwrites: [{
                    id: this.guild.id,
                    deny: 'VIEW_CHANNEL'
                },
                {
                    id: user.id,
                    allow: 'VIEW_CHANNEL'
                },
                {
                    id: user.id,
                    allow: 'SEND_MESSAGES'
                }]
            });
            this.channels.push(channel);
        });

        this.main_channel = await this.guild.channels.create('Головний', {parent: this.category})
        const message = await this.main_channel.send({embeds: [{
            description: `${this.emojis[0]} - видалити кімнату`
        }]});
        await message.react(this.emojis[0])
        
        this.formatRoles();
    }


    async formatRoles () {
        //обчислення кількості гравців ролі
        let m = 1;
        let total_amount = 0;
        this.roles.forEach(role => {
            if(role.name != 'civil'){
                role.amount = Math.floor(this.players_amount / role.min);
                total_amount += role.amount;
            } else {
                role.amount = this.players_amount - total_amount;
            }
            log('[')
            this.sequence.push([]);
            for(let i = 0; i < role.amount; i++){
                log(m);
                this.sequence[i].push(m);
                m++;
            }
            log(']')
            log(`${role.amount} ${role.name}`)
        })

        //рандомний ряд чисел
        log('Рандомний числовий ряд:\n');
        for(let i = 0; i < this.users.length;) {
            
            const number = Math.ceil(Math.random() * this.players_amount);
            let isUnique = true;

            this.random_numbers.forEach(random_number => {
                if (number == random_number) {
                    isUnique = false;
                }
            })

            if (isUnique) {
                this.random_numbers.push(number)
                log(this.random_numbers[i]);
                i++;
            }
        }

        //установлення ролей для кожного гравця
        m = 0;
        this.roles.forEach(async (role, index) => {
            log(role.name);
            for(let i = 0; i < role.amount; i++) {
                const member = await this.guild.members.fetch(this.users[i].id);
                this.players[this.random_numbers[m] - 1] = new Player(member, this.roles[i], this.channels[i]);
                log(`\t${member} ${this.players[this.random_numbers[m] - 1].role.name}`)
                m++;
            }
        });
    }

    async loop() {
        while (this.completed == false) {

        }
    }

    async send_players_markup () {
        this.players_markup = '';
        this.players.forEach(async (player, index) => {
            if(!player.isDead) {
            this.players_markup += `${this.numbers_emojis[index]} ---> _\`${player.member.user.tag}\`_\n`;
            }
        })

        await this.main_channel.send({embeds: [{
            description: this.players_markup
        }]});
    }

    async first_day () {
        await this.main_channel.send({embeds: [{
            description: 'Розпочато _`нульовий день`_. Можете просто поспілкуватись тут\nЧерез 2 хвилини вам повідомиться _`роль`_ і почнеться _`перша ніч`_'
        }]})
        setTimeout(async () => {
            this.players.forEach(async player => {
                await player.channel.send();
            })

            await this.send_players_markup();

        }, 2 * 60 * 1000)

    }





    async remove () {
        
        await this.main_channel.send({embeds: [{
                description: `Кімнату видалить через 5 секунд`
            }]})
        setTimeout(async () => {
            this.channels.forEach(async channel => {
                await channel.delete();
            })

            await this.main_channel.delete();
            await this.category.delete()

            client.games.splice(this.index, 1);

        }, 5 * 1000)
    }




}

module.exports = Mafia;
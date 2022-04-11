const Event = require('../classes/Event.js');
const { log } = require('../classes/Logger.js');
const chat = require('../config/chat.json');
const m_a = require('../config/emotions_actions.json');


const messageCreate = new Event(client, async message => {
    if (message.author.bot || message.channel.type != 'GUILD_TEXT') return; //команди від користувачів, які є ботами не працюватимуть
    log(`<${message.channel.name}> ${message.content}`, 'message');

    let msgStr = message.content;
    const member = await message.guild.members.fetch(message.author.id);

    //const experience = await client.connection.query('SELECT')
    //client.connection.query('UPDATE members SET ')

    //random emojis
    const chance = 1;
    if(Math.ceil(Math.random()*100) <= chance){
        const emojis = await client.guild.emojis.fetch();
        message.react(emojis.random());

    }

    //check adds
    if(msgStr.indexOf('https://discord.gg/') != -1) {
        const links = await message.guild.invites.fetch();

        links.forEach(link => {
            if(msgStr.indexOf(link.toString()) != 1){ //all okay
                return;
            }
        })

        const role = member.roles.highest;
        if(role.toString().toLowerCase() != 'vip' && role.toString().toLowerCase() != 'support'  && role.toString().toLowerCase() != 'underground' && role.toString().toLowerCase() != 'guard' && role.toString().toLowerCase() != 'admin' && role.toString().toLowerCase() != 'redactor' && role.toString().toLowerCase() != 'leader' ){
            return;
        }


        client.owner.send({embeds: [{
            description: `${message.author} рекламував інший діскорд сервер на сервері _Weisttil_!`
        }]})
        
        member.ban({reason: 'Реклама посторонніх діскорд серверів'})
            .catch(log(`Не вдалось забанити порушника ${message.author} під ніком ${message.author.username}`, 'error'))
            .then(() => {
                try {
                    message.author.send({embeds: [{
                    description: 'Ви рекламували посторонній діскорд сервер на сервері _Weisttil_, за що вас було автоматично перманентно забанено. Наступного разу уважніше читайте правила!'
                }]})}
                catch {
                    log(`Не вдалось відправити пояснення учаснику ${message.author} під ніком ${message.author.username} за рекламу діскорд серверів`, 'error')
                }
            })
        message.delete();
    }

    
    
    


    //commands handler
    const prefix = client.config.prefix;
    if(msgStr.toLowerCase().startsWith(prefix)) {
        msgStr = msgStr.slice(prefix.length);

        for (let cname in client.commands) {

            if ((msgStr === cname || msgStr.startsWith(`${cname} `)) && (!client.commands[cname].ownerOnly || member.roles.highest.name == 'leader')) {
      
                let args = msgStr.slice(cname.length).split(' ').filter(el => el != '');

                await client.commands[cname].run(client, message, args);
            } else if((msgStr === cname || msgStr.startsWith(`${cname} `)) && client.commands[cname].ownerOnly) {
                log(`Команда ${cname} доступна лише творцю сервера. Відмовлено у доступі`, 'error')
            }
        }
    }


    //chat
    if(msgStr.trim().indexOf('<@&868886871948804197>') != -1 || msgStr.trim().indexOf('<@!868884079221809223>') != -1 || msgStr.trim().indexOf('<@868884079221809223>') != -1) {
        log(Math.floor(Math.random() * chat.mention.answers.length))
        await message.channel.send(chat.mention.answers[Math.floor(Math.random() * chat.mention.answers.length)])
    }

    chat.helloWords.triggers.forEach(async trigger => {
        if(msgStr.trim().toLowerCase() == trigger.trim().toLowerCase()){
            log(msgStr.trim().toLowerCase())
            log(trigger.trim().toLowerCase())
            let answer = chat.helloWords.answers.general[Math.floor(Math.random() * chat.helloWords.answers.general.length)];
            await message.channel.send(`${answer[0].toUpperCase()}${answer.slice(1)}`)
        }
    })

    //emotions and actions
    m_a.forEach(async element => {
        if(msgStr.trim().toLowerCase() === element.key.toLocaleLowerCase().trim()) {
            await message.channel.send({ embeds: [{
                description: `${message.author} ${element.answer}`,
                image: {
                    url: 'https://tenor.com/view/%D0%B0%D0%B1%D0%BE%D0%B1%D1%83%D1%81-%D0%B4%D0%B0%D1%88%D0%B0-%D0%BA%D0%BE%D1%80%D0%B5%D0%B9%D0%BA%D0%B0-gif-22153053'
                }
            }]});
            await message.delete();
            log(1);
        }
    })
})

module.exports = messageCreate;
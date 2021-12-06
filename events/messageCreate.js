const Event = require('../classes/Event.js');
const { log } = require('../classes/Logger.js');
const chat = require('../config/chat.json');


const messageCreate = new Event(client, async message => {
    if (message.author.bot || message.channel.type != 'GUILD_TEXT') return; //команди від користувачів, які є ботами не працюватимуть
    log(`<${message.channel.name}> ${message.content}`, 'message');

    let msgStr = message.content;
    const member = await message.guild.members.fetch(message.author.id);

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
    if(msgStr.trim().indexOf('<@&868886871948804197>') != -1 || msgStr.trim().indexOf('<@!868884079221809223>') != -1) {
        log(Math.floor(Math.random() * chat.mention.answers.length))
        await message.channel.send(chat.mention.answers[Math.floor(Math.random() * chat.mention.answers.length)])
    }

    chat.helloWords.triggers.forEach(async trigger => {
        if(msgStr.trim().toLowerCase() == trigger.trim()){
            let answer = chat.helloWords.general[Math.floor(Math.random() * chat.helloWords.general.length)];
            await message.channel.send(`${answer[0].toUpperCase()}${answer.slice(1)}`)
        }
    })
    /*client.commandBooks.forEach(book => {
        if(book.channel.id == message.channel.id) {
            
        }
    });*/
})

module.exports = messageCreate;
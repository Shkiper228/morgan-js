const Event = require('../classes/Event.js');
const { log } = require('../classes/Logger.js');


const messageCreate = new Event(client, async message => {
    if (message.author.bot || message.channel.type != 'GUILD_TEXT') return; //команди від користувачів, які є ботами не працюватимуть
    log(`<${message.channel.name}> ${message.content}`, 'message');

    
    const prefix = client.config.prefix;
    let msgStr = message.content;


    if(msgStr.toLowerCase().startsWith(prefix)) {
        msgStr = msgStr.slice(prefix.length);
        member = await message.guild.members.fetch(message.author.id);

        for (let cname in client.commands) {

            if ((msgStr === cname || msgStr.startsWith(`${cname} `)) && (!client.commands[cname].ownerOnly || member.roles.highest.name == 'leader')) {
      
                let args = msgStr.slice(cname.length).split(' ').filter(el => el != '');
                log(`Аргументи ${args}`, 'warning')

                await client.commands[cname].run(client, message, args);
            } else if((msgStr === cname || msgStr.startsWith(`${cname} `)) && client.commands[cname].ownerOnly) {
                log(`Команда ${cname} доступна лише творцю сервера. Відмовлено у доступі`, 'error')
            }
        }
    }

    client.commandBooks.forEach(book => {
        if(book.channel.id == message.channel.id) {
            
        }
    });
})

module.exports = messageCreate;
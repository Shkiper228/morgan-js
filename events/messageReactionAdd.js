const Event = require('../classes/Event.js');
const { log } = require('../classes/Logger.js');


const messageReactionAdd = new Event(client, async (messageReaction, user) => {
    if(user.bot) return;
    log(`<${messageReaction.message.channel.name}> поставив реакцію ${messageReaction.emoji}`);

    client.infoBooks.forEach(book => {
        if(book.channel_id == messageReaction.message.channel.id && book.message.id == messageReaction.message.id) {
            const index = book.emojis.findIndex(element => {
                if(element == messageReaction.emoji.toString()) {
                    return true;
                }
            })
            book.changePage(index);
            messageReaction.users.remove(user);
            return;
        }
    })

    client.commandBooks.forEach(book => {
        if(book.channel_id == messageReaction.message.channel.id && book.message.id == messageReaction.message.id) {
            const index = book.emojis.findIndex(element => {
                if(element == messageReaction.emoji.toString()) {
                    return true;
                }
            })
            book.functions[index](user);
            messageReaction.users.remove(user);
            return;
        }
    })

    // ЗАКІНЧЕНО!!!
    if(messageReaction.message.channelId == client.config_channels.channel_begin) {
        const member = await messageReaction.message.guild.members.fetch(user.id);
        const roles = member.roles;
        if (roles.highest.name.toString() === '@everyone') {
            roles.add('704691487857704980', 'Верифікувався')
        }
    }
    
    client.games.forEach(game => {
        game.forEach(room => {
            
            const player = messageReaction.message.guild.members.fetch(user.id);
            if(!room.channel) return;
            if(!(room.channel.id == messageReaction.message.channel.id)) return;
            if (!room.completed && room.game == 'ticTacToe'){
                let coordinate = -1;

                switch (messageReaction.emoji.toString()) {
                    case room.emojis[0]:
                        coordinate = 0;
                        break;
                    case room.emojis[1]:
                        coordinate = 1;
                        break;
                    case room.emojis[2]:
                        coordinate = 2;
                        break;
                }

                if (room.crossPlayerSteps.length == 0) { //перший хід
                    if (user.id != room.crossPlayer.id) {
                        messageReaction.message.channel.send({embeds: [{
                            description: `${user} зараз не ваш хід!`,
                            color: '#940000'
                        }]})
                        return;
                    }
                    room.crossPlayerSteps.push([]);
                    room.crossPlayerSteps[0].push(coordinate);
                    room.typeQuestion();

                } else if (room.zeroPlayerSteps.length == 0 && room.crossPlayerSteps[room.crossPlayerSteps.length - 1].length != 2) { //перший хід хрестиків завершується
                    if (user.id != room.crossPlayer.id) {
                        messageReaction.message.channel.send(`${user}, зараз не ваш хід!`)
                        return;
                    }
                    room.crossPlayerSteps[0].push(coordinate);
                    room.regMove(room.crossPlayerSteps[room.crossPlayerSteps.length - 1], room.crossPlayer);
                    room.outputMatrix();
                    room.typeQuestion();

                } else if (room.zeroPlayerSteps.length == 0 && room.crossPlayerSteps[room.crossPlayerSteps.length - 1].length == 2) { //перший хід нуликів починається
                    if (user.id != room.zeroPlayer.id) {
                        messageReaction.message.channel.send(`${user}, зараз не ваш хід!`)
                        return;
                    }
                    room.zeroPlayerSteps.push([]);
                    room.zeroPlayerSteps[0].push(coordinate);
                    room.typeQuestion();

                    
                    
                } else if (room.crossPlayerSteps.length == room.zeroPlayerSteps.length) { //однакова кількість ходів
                    if (room.crossPlayerSteps[room.crossPlayerSteps.length - 1].length == 2 && room.zeroPlayerSteps[room.zeroPlayerSteps.length - 1].length == 2) { //останні ходи обох гравців завершені
                        if (user.id != room.crossPlayer.id) {
                            messageReaction.message.channel.send(`${user}, зараз не ваш хід!`)
                            return;
                        }
                        room.crossPlayerSteps.push([]);
                        room.crossPlayerSteps[room.crossPlayerSteps.length - 1].push(coordinate);
                        room.typeQuestion();

                    } else if (room.crossPlayerSteps[room.crossPlayerSteps.length - 1].length == 2 && room.zeroPlayerSteps[room.zeroPlayerSteps.length - 1].length != 2) { //останній хід хрестика завершений, а нуля - ні
                        if (user.id != room.zeroPlayer.id) {
                            messageReaction.message.channel.send(`${user}, зараз не ваш хід!`)
                            return;
                        }
                        room.zeroPlayerSteps[room.zeroPlayerSteps.length - 1].push(coordinate);
                        room.regMove(room.zeroPlayerSteps[room.zeroPlayerSteps.length - 1], room.zeroPlayer);
                        room.outputMatrix();
                        room.typeQuestion();

                    }
                } else if(room.crossPlayerSteps.length > room.zeroPlayerSteps.length){ //кількість ходів хрестиків більше нуликів
                    if (room.crossPlayerSteps[room.crossPlayerSteps.length - 1].length == 2 && room.zeroPlayerSteps[room.zeroPlayerSteps.length - 1].length == 2) { //останні ходи обох гравців завершені
                        if (user.id != room.zeroPlayer.id) {
                            messageReaction.message.channel.send(`${user}, зараз не ваш хід!`)
                            return;
                        }
                        room.zeroPlayerSteps.push([]);
                        room.zeroPlayerSteps[room.zeroPlayerSteps.length - 1].push(coordinate);
                        room.typeQuestion();

                    } else if (room.crossPlayerSteps[room.crossPlayerSteps.length - 1].length != 2 && room.zeroPlayerSteps[room.zeroPlayerSteps.length - 1].length == 2) { //останній хід хрестика завершений, а нуля - ні
                        if (user.id != room.crossPlayer.id) {
                            messageReaction.message.channel.send(`${user}, зараз не ваш хід!`)
                            return;
                        }
                        room.crossPlayerSteps[room.crossPlayerSteps.length - 1].push(coordinate);
                        room.regMove(room.crossPlayerSteps[room.crossPlayerSteps.length - 1], room.crossPlayer);
                        room.outputMatrix();
                        room.typeQuestion();
                    }
                }


                let stringX = 'Ходи гравця X:'
                room.crossPlayerSteps.forEach(step => {
                    stringX += '[';
                    step.forEach(coordinate => {
                        stringX += `${coordinate} `
                    })
                    stringX += '] '
                })
                log(stringX);

                let stringO = 'Ходи гравця O:'
                room.zeroPlayerSteps.forEach(step => {
                    stringO += '[';
                    step.forEach(coordinate => {
                        stringO += `${coordinate} `;
                    })
                    stringO += '] ';
                })
                log(stringO);
            } else if(room.completed && messageReaction.emoji.toString() == room.emojis[3]) {
                room.remove();
                log(`Видаляю гру в ${room.game}!`, 'warning');
            } else if(room.game == 'mafia') {
                
            }
        })
    })

    
        
        
});

module.exports = messageReactionAdd;
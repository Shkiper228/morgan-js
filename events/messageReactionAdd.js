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
    
    client.games.ticTacToe.forEach(game => {
        
        const player = messageReaction.message.guild.members.fetch(user.id);
        if(!game.channel) return;
        if (game.channel.id == messageReaction.message.channel.id && !game.completed){
            let coordinate = -1;

            switch (messageReaction.emoji.toString()) {
                case game.emojis[0]:
                    coordinate = 0;
                    break;
                case game.emojis[1]:
                    coordinate = 1;
                    break;
                case game.emojis[2]:
                    coordinate = 2;
                    break;

                case game.emojis[3]:
                    game.remove();
                    log('Видаляю!');
                    return;
                    break;
            }

            if (game.crossPlayerSteps.length == 0) { //перший хід
                if (user.id != game.crossPlayer.id) {
                    messageReaction.message.channel.send({embeds: [{
                        description: `${user} зараз не ваш хід!`,
                        color: '#940000'
                    }]})
                    return;
                }
                game.crossPlayerSteps.push([]);
                game.crossPlayerSteps[0].push(coordinate);
                game.typeQuestion();

            } else if (game.zeroPlayerSteps.length == 0 && game.crossPlayerSteps[game.crossPlayerSteps.length - 1].length != 2) { //перший хід хрестиків завершується
                if (user.id != game.crossPlayer.id) {
                    messageReaction.message.channel.send(`${user}, зараз не ваш хід!`)
                    return;
                }
                game.crossPlayerSteps[0].push(coordinate);
                game.regMove(game.crossPlayerSteps[game.crossPlayerSteps.length - 1], game.crossPlayer);
                game.outputMatrix();
                game.typeQuestion();

            } else if (game.zeroPlayerSteps.length == 0 && game.crossPlayerSteps[game.crossPlayerSteps.length - 1].length == 2) { //перший хід нуликів починається
                if (user.id != game.zeroPlayer.id) {
                    messageReaction.message.channel.send(`${user}, зараз не ваш хід!`)
                    return;
                }
                game.zeroPlayerSteps.push([]);
                game.zeroPlayerSteps[0].push(coordinate);
                game.typeQuestion();

                
                
            } else if (game.crossPlayerSteps.length == game.zeroPlayerSteps.length) { //однакова кількість ходів
                if (game.crossPlayerSteps[game.crossPlayerSteps.length - 1].length == 2 && game.zeroPlayerSteps[game.zeroPlayerSteps.length - 1].length == 2) { //останні ходи обох гравців завершені
                    if (user.id != game.crossPlayer.id) {
                        messageReaction.message.channel.send(`${user}, зараз не ваш хід!`)
                        return;
                    }
                    game.crossPlayerSteps.push([]);
                    game.crossPlayerSteps[game.crossPlayerSteps.length - 1].push(coordinate);
                    game.typeQuestion();

                } else if (game.crossPlayerSteps[game.crossPlayerSteps.length - 1].length == 2 && game.zeroPlayerSteps[game.zeroPlayerSteps.length - 1].length != 2) { //останній хід хрестика завершений, а нуля - ні
                    if (user.id != game.zeroPlayer.id) {
                        messageReaction.message.channel.send(`${user}, зараз не ваш хід!`)
                        return;
                    }
                    game.zeroPlayerSteps[game.zeroPlayerSteps.length - 1].push(coordinate);
                    game.regMove(game.zeroPlayerSteps[game.zeroPlayerSteps.length - 1], game.zeroPlayer);
                    game.outputMatrix();
                    game.typeQuestion();

                }
            } else if(game.crossPlayerSteps.length > game.zeroPlayerSteps.length){ //кількість ходів хрестиків більше нуликів
                if (game.crossPlayerSteps[game.crossPlayerSteps.length - 1].length == 2 && game.zeroPlayerSteps[game.zeroPlayerSteps.length - 1].length == 2) { //останні ходи обох гравців завершені
                    if (user.id != game.zeroPlayer.id) {
                        messageReaction.message.channel.send(`${user}, зараз не ваш хід!`)
                        return;
                    }
                    game.zeroPlayerSteps.push([]);
                    game.zeroPlayerSteps[game.zeroPlayerSteps.length - 1].push(coordinate);
                    game.typeQuestion();

                } else if (game.crossPlayerSteps[game.crossPlayerSteps.length - 1].length != 2 && game.zeroPlayerSteps[game.zeroPlayerSteps.length - 1].length == 2) { //останній хід хрестика завершений, а нуля - ні
                    if (user.id != game.crossPlayer.id) {
                        messageReaction.message.channel.send(`${user}, зараз не ваш хід!`)
                        return;
                    }
                    game.crossPlayerSteps[game.crossPlayerSteps.length - 1].push(coordinate);
                    game.regMove(game.crossPlayerSteps[game.crossPlayerSteps.length - 1], game.crossPlayer);
                    game.outputMatrix();
                    game.typeQuestion();
                }
            }


            let stringX = 'Ходи гравця X:'
            game.crossPlayerSteps.forEach(step => {
                stringX += '[';
                step.forEach(coordinate => {
                    stringX += `${coordinate} `
                })
                stringX += '] '
            })
            log(stringX);

            let stringO = 'Ходи гравця O:'
            game.zeroPlayerSteps.forEach(step => {
                stringO += '[';
                step.forEach(coordinate => {
                    stringO += `${coordinate} `;
                })
                stringO += '] ';
            })
            log(stringO);
        }
    })
});

module.exports = messageReactionAdd;
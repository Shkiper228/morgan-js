const Command = require('../classes/Command.js');
const {log} = require('../classes/Logger.js')
const TicTacToe = require('../games/TicTacToe.js')


const tictactoe = new Command(client, {
    name: 'tictactoe',
    description: 'Команда для створення гри в хрестики-нолики',
    ownerOnly: false,
    adminOnly: false
}, async (client, message, args) => {
    if (args[0] === 'create') {

        if (args[2] == args[3]) {
            message.channel.send({embeds: [{
                description: `${message.author} не можна в якості гравців передавати одного учасника двічі`,
                color: '#940000'
            }]})
            return;
        }

        try {
            players = [await message.guild.members.fetch(args[2]), await message.guild.members.fetch(args[3])]

        } catch {
            message.channel.send({embeds : [{
                description: `${message.member} Ви неправильно ввели одного з гравців!`,
                color: '#940000'
            }]})
            return;
        }
        
        client.games.ticTacToe.push(new TicTacToe(client, players, {
            name: args[1],
            channel: await message.guild.channels.create(`_Хрестики-нулики ${args[1]}`, {
                userLimit: 2,
                permissionOverwrites: [{
                    id: message.guild.id,
                    deny: 'VIEW_CHANNEL'
                },

                {
                    id: players[0].id,
                    allow: 'VIEW_CHANNEL'
                },

                {
                    id: players[1].id,
                    allow: 'VIEW_CHANNEL'
                }
                ]
            })
        }))

        currentGame = client.games.ticTacToe[client.games.ticTacToe.length - 1]

        currentGame.outputMatrix();
        currentGame.typeQuestion();
    }
})
module.exports = tictactoe;
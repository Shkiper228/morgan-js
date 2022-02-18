const {MessageEmbed} = require('discord.js');
const fs = require('fs');
const {log} = require('../Logger.js');
const Book = require('./Book.js');


class InfoBook extends Book {
    constructor (client, channel_id, folder_path, index) {
        super(client, channel_id);
        this.pages = [];
        this.files = [];
        this.contentPage = '0 - Зміст\n';
        this.index = index;


        fs.readdirSync(`${folder_path}`).forEach(file => {
            this.files.push(file.toString());
            this.pages.push([]);

            const strs = fs.readFileSync(`${folder_path}/${file.toString()}`).toString().split('\n');
            
            strs.forEach(stroke => {
                this.pages[this.pages.length - 1].push(stroke);
            })
        })

        for(let i = 0; i < this.files.length; i++){
            this.contentPage += `${i + 1} - ${this.files[i].slice(0, this.files[i].length - 4)}\n`
        }

        this.length = this.pages.length;
    }

    async start () {
        //start
        this.channel = await client.channels.fetch(this.channel_id);

        const message_id = this.channel.lastMessageId;
        let message;

        try {
            message = await this.channel.messages.fetch(message_id);
            if(message.author.id == this.client.user.id) {
                message.edit({embeds: [{
                    title: 'Зміст',
                    description: this.contentPage
                }]});
            } else {
                log(`В каналі ${channel.name} для інформаційної книги присутні посторонні повідомлення. Усуньте їх для роботи`, 'error')
                this.client.infoBook.splice(this.index, this.index);
            }
        } catch {
            message = await this.channel.send({embeds: [{
                title: 'Зміст',
                description: this.contentPage
            }]});
        }
        this.message = message;
        this.currentPage = this.emojis.length - 1;
        
        
        //resending emojis
        await message.reactions.removeAll();

        await message.react(this.emojis[this.emojis.length - 1])

        for(let i = 0; i < this.length; i++) {
            message.react(this.emojis[i]);
        }
    }

    changePage (pageNumber) {
        if(pageNumber != this.currentPage) {
            if(pageNumber == this.emojis.length - 1) {
                this.message.edit({embeds: [{
                    title: 'Зміст',
                    description: this.contentPage
                }]});
            } else {
                const embed = new MessageEmbed({
                    title: this.files[pageNumber].slice(0, -3),

                })
                this.pages[pageNumber].forEach((page, index) => {
                    embed.addField(`_-|${index + 1}|-_`, page);
                })

                this.message.edit({embeds: [embed]});
            }

            this.currentPage = pageNumber;
        }
    }
}

module.exports = InfoBook;
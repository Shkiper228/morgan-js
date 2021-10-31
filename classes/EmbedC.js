const {MessageEmbed} = require('discord.js');

class EmbedC {
    constructor({description, color, title}) {
        this.embeds = [{
            description: description,
            title: title,
            color: color
        }]   
    }
}
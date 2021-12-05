const { Client, Intents } = require('discord.js');
const utils = require('../utils.js');
const { log } = require('../classes/Logger.js');
const InfoBook = require('../classes/books/InfoBook.js');
const config = require('../config/config.json')
const fs = require('fs');
const token = require('../token.json');

class Morgan extends Client {
    constructor () {
        super({
            intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MEMBERS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
				Intents.FLAGS.GUILD_VOICE_STATES,
				Intents.FLAGS.DIRECT_MESSAGES
			],
			allowedMentions: {
				parse: ["users"]
            }
        })

        this.config = require('../config/config.json');
		this.config_channels = require('../config/channels.json');

		this.commandBooks = [];

		this.gameList = ['ticTacToe', 'mafia'];

		this.games = [];
		this.gameQueues = [];
		
		this.gameList.forEach(game => {
			this.games[game] = [];

			this.gameQueues[game] = [];
		})
    }

	async init() {
		this.guild = await this.guilds.fetch(config.guild);
		this.owner = await this.guild.members.fetch('506215900836265995');

		await this.loadCommands();
		await this.loadEvents();
		await this.loadInfoBooks();


		const begin_channel = await this.guild.channels.fetch(this.config_channels.channel_begin);

		let message;
		try {
			message = await begin_channel.messages.fetch(begin_channel.lastMessageId);
            /*if(message) {
                log(`В каналі ${begin_channel.name} для верифікації присутні посторонні повідомлення. Усуньте їх для роботи`, 'error')
            }*/
        } catch {
            message = await begin_channel.send({embeds: [{
                title: '_*ВЕРИФІКАЦІЯ*_',
                description: `Ласкаво просимо на сервері! Ви новачок, тож не верифіковані і не можете повноцінно перебувати на сервері.\nЩоб верифікуватись прочитайте правила<#704384154925662280>\nТа деяку загальну інформацію<#842853700237656135>\nНажміть реакцію для верифікації`
            }]});
			message.react('✅');
        }
	}

	async loadCommands () {
		this.commands = [];
		const path = this.config.commands_path;
		log('Команди завантажуються...');

		fs.readdirSync(`${path}`).forEach(file => {
			if(file.endsWith('.js')) {
				const cname = file.substring(0, file.length-3);
				const command = require(`../${path}/${file.toString()}`);
				this.commands[cname] = command;

				log(`\tКоманду ${file.toLowerCase().substring(0, file.length-3)} завантажено`);
			}
		})
		log('Усі команди завантажено')
	}

	async loadEvents () {
		this.events = [];
		const path = this.config.events_path;
		log('Події завантажуються...');

		fs.readdirSync(`${path}`).forEach(file => {
			if(file.endsWith('.js')) {
				const ename = file.substring(0, file.length-3);
				const event = require(`../${path}/${file.toString()}`);

				this.on(ename, event.run);

				log(`\tПодію ${file.toLowerCase().substring(0, file.length-3)} завантажено`);
			}
		})
		log('Усі події завантажено')
	}

	async loadInfoBooks () {
		this.infoBooks = [];
		const channels = this.guild.channels.cache;
		const path = this.config.books_path;

		fs.readdirSync(`${path}/infoBooks`).forEach(folder => {

			const channel = channels.find(channel => {
				if(channel.name === folder.toString().replace(' ', '-')) return true
			})


			
			if (channel){
				const book = new InfoBook(this, channel.id, `${path}/infoBooks/${folder.toString()}`, this.infoBooks.length);
				book.start();
				this.infoBooks.push(book);
			} else {
				log(`Каналу для книжки ${folder.toString()} не знайдено. Створюємо...`, 'warning');
				this.guild.channels.create(folder.toString()).then(channel => {
					const book = new InfoBook(this, channel.id, `${path}/infoBooks/${folder.toString()}`, this.infoBooks.length);
					book.start();
					this.infoBooks.push(book);
				})
			}
		})
	}

	

	login () {
		try {
			const tokenLocal = require('../token.json').token;
			super.login(tokenLocal)
		} catch {
			super.login(process.env.token);
		}
	}
}

module.exports = Morgan;
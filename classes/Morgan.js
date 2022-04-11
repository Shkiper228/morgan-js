const { Client, Intents } = require('discord.js');
const utils = require('../utils.js');
const { log } = require('../classes/Logger.js');
const InfoBook = require('../classes/books/InfoBook.js');
const config = require('../config/config.json');
const { Prohairesis } = require('prohairesis');
const fs = require('fs');
const mysql = require('mysql2/promise');
const { threadId } = require('worker_threads');
const { rejects } = require('assert');

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
    }

	async init() {
		this.guild = await this.guilds.fetch(config.guild);
		this.owner = await this.guild.members.fetch('506215900836265995');

		await this.loadCommands();
		await this.loadEvents();
		await this.loadInfoBooks();
		//await this.dbConnection();
		//await this.regMembers();

		const begin_channel = await this.guild.channels.fetch(this.config_channels.channel_begin);
		let message;
		try {
			message = await begin_channel.messages.fetch(begin_channel.lastMessageId);
			log(message.id)
			message.react('✅');
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

	async dbConnection () {
		try {
			this.connection = await mysql.createConnection({
				host: process.env.DB_HOST != undefined ? process.env.DB_HOST : require('../secret.json').db.DB_HOST,
				user: process.env.DB_USERNAME != undefined ? process.env.DB_USERNAME : require('../secret.json').db.DB_USERNAME,
				password: process.env.DB_PASSWORD != undefined ? process.env.DB_PASSWORD : require('../secret.json').db.DB_PASSWORD,
				database: process.env.DB_DATABASE != undefined ? process.env.DB_DATABASE : require('../secret.json').db.DB_DATABASE
			});

			await this.connection.connect();
			log('Підключення успішно укладене');
			
			await this.connection.execute(`CREATE TABLE IF NOT EXISTS members(
				id bigint NOT NULL,
				name varchar(255),
				messages int,
				experience int,
				level int DEFAULT 1,
				PRIMARY KEY (ID)
			)`)
			
			const members = await this.guild.members.fetch(); //всі мембери
			await members.forEach(async member => {
				const fetchedMember = await this.connection.execute(`SELECT * FROM members WHERE \`id\` = \"${member.id}\"`)
				console.log(fetchedMember[0][0])
				if(!fetchedMember[0][0] && !member.user.bot){
					await this.connection.query(`INSERT INTO members (id, name, messages, experience) VALUES(${member.id},\"${member.user.username.toString()}\",0,0)`);
					console.log(`Мембера ${member.user.username} додано до бази даних`, 'warning')
				}
			})

			//await this.connection.end();

			//log('Підключення успішно розірвано')

		} catch (e) {
			log(e, 'error');
		}


		try {
			
			//console.log(await this.connection.query('SHOW TABLES'));
		} catch (e) { 
			log(e, 'error')
		}
			
		await this.connection.end(err => {
			if (err) { throw err }

			log('Підключення з базою даних відключено')
		});
		

		/*new Promise((resolve, rejects) => {
			log('Підключаємся...');
			const conn = mysql.createConnection({
				host: process.env.DB_HOST != undefined ? process.env.DB_HOST : require('../secret.json').db.DB_HOST,
				user: process.env.DB_USERNAME != undefined ? process.env.DB_USERNAME : require('../secret.json').db.DB_USERNAME,
				password: process.env.DB_PASSWORD != undefined ? process.env.DB_PASSWORD : require('../secret.json').db.DB_PASSWORD,
				database: process.env.DB_DATABASE != undefined ? process.env.DB_DATABASE : require('../secret.json').db.DB_DATABASE
			})

			resolve(conn)
		}).then((conn) => {
			log('Підключення до бази даних укладене');
			this.connection = conn;
		}).then(() => {
			this.connection.execute(`CREATE TABLE IF NOT EXISTS members(
				id bigint NOT NULL,
				name varchar(255),
				messages int,
				experience int,
				PRIMARY KEY (ID)
			)`)
			this.connection.query('SHOW TABLES').then(result => console.log(result))
		})*/



		/*
		this.connection = await mysql.createConnection({
			host: process.env.DB_HOST != undefined ? process.env.DB_HOST : require('../secret.json').db.DB_HOST,
			user: process.env.DB_USERNAME != undefined ? process.env.DB_USERNAME : require('../secret.json').db.DB_USERNAME,
			password: process.env.DB_PASSWORD != undefined ? process.env.DB_PASSWORD : require('../secret.json').db.DB_PASSWORD,
			database: process.env.DB_DATABASE != undefined ? process.env.DB_DATABASE : require('../secret.json').db.DB_DATABASE
		})

		await this.connection.connect( (err) => {
			if (err) {
				return log('Не вдалось підключитись з базою даних', 'error')
			} else {
				log('Підключення до бази даних успішне')
			}
		})

		await this.connection.execute(`CREATE TABLE IF NOT EXISTS members(
			id bigint NOT NULL,
			name varchar(255),
			messages int,
			experience int,
			PRIMARY KEY (ID)
		)`);*/

	}


	
	async regMembers () {
			
				/*.then(results => {
					if(!results[0]) {
						log(`Учасника сервера з id ${member.id} не було знайдено в таблиці`, 'warning');
						this.connection.query('INSERT INTO members (id, name, messages, experience) VALUES(125, nick,0,0)');
					}
					console.log(results)
				})
			
			
			(error, rows, fields) => {
				log(1);
				if(!rows[0]) {
					const sql = `INSERT INTO members (id, name, messages, experience) VALUES(${member.id},0,0,0)`;
					log(`Учасника сервера з id ${member.id} не було знайдено в таблиці`, 'warning');
					this.connection.query(sql);
				}
				this.connection.query(`SELECT id FROM members WHERE id = ${member.id}`, (error, rows, fields) => {
					log(member.id);
					console.log(rows);
				});
			});*/
			
			//this.connection.query(`INSERT INTO members VALUES (${member.id}, ${member.user.tag})`)
	}
	
	

	login () {
		try {
			const tokenLocal = require('../secret.json').token;
			super.login(tokenLocal)
		} catch {
			super.login(process.env.token);
		}
	}
}

module.exports = Morgan;
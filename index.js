const Discord = require("discord.js"); 
const Morgan = require('./classes/Morgan.js'); 
const config = require("./config/config.json");
const channels = require("./config/channels.json");
const utils = require('./utils');
const { log } = require('./classes/Logger.js');
const fs = require('fs');

client = new Morgan();


client.on('ready', () => {
    log(`Logged as ${client.user.tag}`)
    client.init();
})

process.on('unhandledRejection', error => {
    log(`Unhendled rejection: ${error}`, 'error');
})


client.login();
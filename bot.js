const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");
require('./util/eventLoader')(client);

let config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

client.login(config.token);

const Discord = require('discord.js');
const config = require("./config.json");
const fs = require("fs");

const bot = new Discord.Client();

let ballAnswers = JSON.parse(fs.readFileSync('./8ball.json', 'utf8'));

bot.on('ready', () => {
  console.log('BitBot is ready');
});

bot.on('message', msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(config.prefix)) return;

  let command = msg.content.split(' ')[0];
  command = command.slice(config.prefix.length);

  if (command == 'ping') {
    msg.channel.sendMessage('pong!');
  }

  if (command == 'help') {
    msg.channel.sendMessage('I am a noob and can only reply to !ping :(');
  }

  if (command == '8ball') {
    msg.channel.sendMessage(ballAnswers[Math.floor(Math.random() * 20) +1]);
  }
  if (msg.content.startsWith(config.prefix + 'russian')) {
    let bullet = 3;
    if (Math.floor(Math.random() * 6) + 1 == bullet) {
      msg.channel.sendMessage('BANG!');
    } else {
      msg.channel.sendMessage('CLICK');
    }
  }
});

bot.login(config.token);

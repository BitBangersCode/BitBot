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

  let args = msg.content.split(' ').slice(1);

  if (command == 'ping') {
    msg.channel.sendMessage('pong!');
  }

  if (command == 'help') {
    msg.channel.sendMessage('I am a noob and can only reply to !ping :(');
  }

  if (command == '8ball') {
    msg.channel.sendMessage(ballAnswers[Math.floor(Math.random() * 20) +1]);
  }
  if (command == 'russian') {
    let chamber = 1;
    if (!args[0]) {
      msg.channel.sendMessage('erro no args')
    }
    if (args[0] == 'load') {
        let bullet = Math.floor(Math.random() * 6) + 1;
    }
    if (args[0] == 'pull') {
      if (bullet == chamber) {
        msg.channel.sendMessage('BANG!');
      } else {
        msg.channel.sendMessage('CLICK!');
        bullet -= 1;
      }
    }
    if (args[0] == 'spin') {
      let bullet = Math.floor(Math.random() * 6) + 1;
    }
  }
});

bot.login(config.token);

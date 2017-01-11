const Discord = require('discord.js');
const config = require("./config.json");
const fs = require("fs");

const bot = new Discord.Client();

let ballAnswers = JSON.parse(fs.readFileSync('./8ball.json', 'utf8'));
var bullet = 0;

bot.on('ready', () => {
  console.log('BitBot is ready');
});

bot.on('message', msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(config.prefix)) return;

  let command = msg.content.split(' ')[0];
  command = command.slice(config.prefix.length);

  let args = msg.content.split(' ').slice(1);

  if (command == 'say') {
    msg.channel.sendMessage(args.join(' '));
  }
  
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
      msg.channel.sendMessage('Usage: !russian load, !russian spin, !russian pull');
    }
    if (args[0] == 'load') {
      if (bullet == 0) {
        bullet = Math.floor(Math.random() * 6) + 1;
        msg.channel.sendMessage('Loading bullet...');
      } else if (bullet > 0) {
        msg.channel.sendMessage('Bullet already loaded...');
      }
    }
    if (args[0] == 'pull') {
      if (bullet > 0) {
        if (bullet == chamber) {
          msg.channel.sendMessage('BANG!');
          bullet -= 1;
        } else {
          msg.channel.sendMessage('CLICK!');
          bullet -= 1;
        }
      } else {
        msg.channel.sendMessage("Please load the gun...");
      }
    }
    if (args[0] == 'spin') {
      if (bullet > 0){
        bullet = Math.floor(Math.random() * 6) + 1;
        msg.channel.sendMessage('Spinning chamber...');
      } else {
        msg.channel.sendMessage("Please load the gun...");
      }
    }
  }
});

bot.login(config.token);

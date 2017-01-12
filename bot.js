const Discord = require('discord.js');
const config = require("./config.json");
const fs = require("fs");

const bot = new Discord.Client();
const helpMessage = `\`\`\`
Usage:
        !help     - Shows this help message.
        !ping     - Pong!
        !8ball    - Ask me a question.
        !russian  - Russian Roulette. Death = 10 minute mute!
                  - load  - Loads a bullet.
                  - spin  - Spins the chamber.
                  - pull  - Pulls the trigger.
\`\`\``;

let ballAnswers = JSON.parse(fs.readFileSync('./8ball.json', 'utf8'));
var bullet = 0;

bot.on('ready', () => {
  console.log('BitBot is ready');
});

bot.on('message', message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  let command = message.content.split(' ')[0];
  command = command.slice(config.prefix.length);

  let args = message.content.split(' ').slice(1);

  if (command == 'say') {
    message.channel.sendMessage(args.join(' '));
  }

  if (command == 'ping') {
    message.channel.sendMessage('pong!');
  }

  if (command == 'help') {
    message.channel.sendMessage(helpMessage);
  }

  if (command == '8ball') {
    message.channel.sendMessage(ballAnswers[Math.floor(Math.random() * 20) +1]);
  }

  if (command == 'russian') {
    let chamber = 1;
    if (!args[0]) {
      message.channel.sendMessage('Usage: !russian load, !russian spin, !russian pull');
    }
    if (args[0] == 'load') {
      if (bullet == 0) {
        bullet = Math.floor(Math.random() * 6) + 1;
        message.channel.sendMessage('Loading bullet...');
      } else if (bullet > 0) {
        message.channel.sendMessage('Bullet already loaded...');
      }
    }
    if (args[0] == 'pull') {
      if (bullet > 0) {
        if (bullet == chamber) {
          let role = message.guild.roles.find('name', config.deathRole);
          message.channel.sendMessage('BANG!');
          message.channel.sendMessage(message.member +'\'s brains explode! Rest in peace.' )
          if (role) {
            message.member.addRole(role).catch(console.error);
            setTimeout(function() {
              message.channel.sendMessage(message.member + ' has risen from the dead!')
              message.member.removeRole(role).catch(console.error);
            }, 300000);
          } else {
            message.channel.sendMessage('No Death role. Please add Death role and update config.')
          }
          bullet -= 1;
        } else {
          message.channel.sendMessage('CLICK!');
          bullet -= 1;
        }
      } else {
        message.channel.sendMessage("Please load the gun...");
      }
    }
    if (args[0] == 'spin') {
      if (bullet > 0){
        bullet = Math.floor(Math.random() * 6) + 1;
        message.channel.sendMessage('Spinning chamber...');
      } else {
        message.channel.sendMessage("Please load the gun...");
      }
    }
  }
});

bot.login(config.token);

const Discord = require('discord.js');
const fs = require("fs");

const bot = new Discord.Client();

const helpMessage = `\`\`\`
Usage:
!help     - Shows this help message.
!ping     - Pong!
!8ball    - Ask me a question.
!russian  - Russian Roulette. Death = Banished to hell!
- load  - Loads a bullet.
- spin  - Spins the chamber.
- pull  - Pulls the trigger.
\`\`\``;

let ballAnswers = JSON.parse(fs.readFileSync('./8ball.json', 'utf8'));
let config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
let stats = JSON.parse(fs.readFileSync('./stats.json', 'utf8'));
var bullet = 0;

bot.on('ready', () => {
  console.log('bot is ready');
});

bot.on('message', message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  if (!stats[message.author.id]) {
    stats[message.author.id] = {deaths: 0}
  }

  let command = message.content.split(' ')[0];
  command = command.slice(config.prefix.length);

  let args = message.content.split(' ').slice(1);

  if (command == 'say') {
    message.channel.sendMessage(args.join(' '));
  }

  if (command == 'stats') {
    if (!args[0]) {
      message.channel.sendMessage(`\`\`\`
        Stats for ${message.member.user.username}
        Deaths:   ${stats[message.author.id].deaths}
        \`\`\``);
    } else {
      let mention = message.mentions.users.first();
      if (mention && !mention.bot) {
        if (!stats[mention.id]) {
          stats[mention.id] = {deaths: 0};
        }
        message.channel.sendMessage(`\`\`\`
          Stats for ${mention.username}
          Deaths:   ${stats[mention.id].deaths}
          \`\`\``);
      } else {
        message.channel.sendMessage(`No stats for user. Either a group mention, a bot, or user does not exist`);
      }
    }

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
      if (!args[0] || args[0] == 'help') {
        message.channel.sendMessage(`\`\`\`
          Usage:
          !russian  - Russian Roulette. Death = 10 minute mute!
          - load  - Loads a bullet.
          - spin  - Spins the chamber.
          - pull  - Pulls the trigger.
          \`\`\``);
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
              message.channel.sendMessage('BANG!');
              stats[message.author.id].deaths++;
              let role = message.guild.roles.find('name', config.deathRole);
              if (role) {
                if (message.member.roles.has(role.id)) {
                  message.channel.sendMessage(`${message.member} is already dead but somehow manages to shoot themselves anyway. Must be a zombie?`)
                } else {
                  message.member.addRole(role).catch(console.error);
                  message.channel.sendMessage(`${message.member}s brains explode! Rest in peace.`);
                  setTimeout(function() {
                    message.channel.sendMessage(`${message.member} has risen from the dead!`);
                    message.member.removeRole(role).catch(console.error);
                  }, 300000);
                }
              } else {
                message.channel.sendMessage('No Death role. Please add Death role and update config.');
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
      fs.writeFile('./stats.json', JSON.stringify(stats), (err) => {
        if (err) {
          console.log(err)
        }
      });
    });

    bot.login(config.token);

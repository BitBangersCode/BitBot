const Discord = require('discord.js');
const fs = require("fs");

const bot = new Discord.Client();

let ballAnswers = JSON.parse(fs.readFileSync('./8ball.json', 'utf8'));
let config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
let stats = JSON.parse(fs.readFileSync('./stats.json', 'utf8'));
var bullet = 0;

const helpMessage = `\`\`\`
Usage:
        ${config.prefix}help     - Shows this help message.
        ${config.prefix}ping     - Pong!
        ${config.prefix}8ball    - Ask me a question.
        ${config.prefix}russian  - Russian Roulette. Death = Banished to hell!
                  - load  - Loads a bullet.
                  - spin  - Spins the chamber.
                  - pull  - Pulls the trigger.
        ${config.prefix}stats    - Display user stast.
\`\`\``;

bot.on('ready', () => {
  console.log('bot is ready');
});

bot.on('message', message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;
  if (!stats[message.author.id]) {
    stats[message.author.id] = {deaths: 0, spins: 0, pulls: 0}
  }

  let statsMessage = `\`\`\`
  Stats for ${message.member.user.username}
          Deaths:   ${stats[message.author.id].deaths}
          Spins:    ${stats[message.author.id].spins}
          Pulls:    ${stats[message.author.id].pulls}
  \`\`\``

  let command = message.content.split(' ')[0];
  command = command.slice(config.prefix.length);

  let args = message.content.split(' ').slice(1);

  if (command == 'kill'){
    let role = message.guild.roles.find('name', config.deathRole);
    if (!args[0]) {
      if (message.member.roles.has(role.id)) {
        message.channel.sendMessage(`${message.member} is already dead.`);
      } else {
        message.member.addRole(role);
        message.channel.sendMessage(`${message.member} has been killed and sent to hell!`);
      }
    } else {
      let mention = message.mentions.users.first();
      if (mention && !mention.bot) {
        let member = message.guild.member(mention);
        member.addRole(role);
        message.channel.sendMessage(`${message.member} has been killed and sent to hell!`);
      } else {
        message.channel.sendMessage(`Cannot kill user. Either a group mention, a bot, or user does not exist`);
      }
    }
  }

  if (command == 'revive'){
    let role = message.guild.roles.find('name', config.deathRole);
    if (!args[0]) {
      if (message.member.roles.has(role.id)) {
        message.member.removeRole(role);
        message.channel.sendMessage(`${message.member} have been brought back to the land of the living and is now alive!`);
      } else {
        message.channel.sendMessage(`${message.member} is already alive.`);
      }
    } else {
      let mention = message.mentions.users.first();
      if (mention && !mention.bot) {
        let member = message.guild.member(mention);
        member.removeRole(role);
        message.channel.sendMessage(`${message.member} have been brought back to the land of the living and is now alive!`);
      } else {
        message.channel.sendMessage(`Cannot revive user. Either a group mention, a bot, or user does not exist`);
      }
    }
  }

  if (command == 'say') {
    message.channel.sendMessage(args.join(' '));
  }

  if (command == 'stats') {
    if (!args[0]) {
      message.channel.sendMessage(statsMessage);
    } else {
      let mention = message.mentions.users.first();
      if (mention && !mention.bot) {
        if (!stats[mention.id]) {
          stats[mention.id] = {deaths: 0, spins: 0, pulls: 0}
        }
        `\`\`\`
Stats for ${mention.username}
        Deaths:   ${stats[mention.id].deaths}
        Spins:    ${stats[mention.author.id].spins}
        Pulls:    ${stats[mention.author.id].pulls}
        \`\`\``
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
          ${config.prefix}russian  - Russian Roulette. Death = 10 minute mute!
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
          stats[message.author.id].pulls++;
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
              }, 600000);
            }
          } else {
            message.channel.sendMessage('No Death role. Please add Death role and update config.');
          }
          bullet -= 1;
        } else {
          stats[message.author.id].pulls++;
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
        stats[message.author.id].spins++;
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

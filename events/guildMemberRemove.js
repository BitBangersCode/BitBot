const Discord = require('discord.js');
const config = require('../config.json');

module.exports = member => {
  const embed = new Discord.RichEmbed();
  let logChannel = member.client.channels.find('name', config.logChannel);
  if (!logChannel) return console.log('Log Channel does not exist');
  embed.setTitle('User Removed');
  embed.setColor('#BA2A29');
  embed.setTimestamp();
  embed.setDescription(`User ${member.user.username} has left the server.`);
  member.client.channels.get(logChannel.id).sendEmbed(embed);
};

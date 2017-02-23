const Discord = require('discord.js');
const config = require('../config.json');

module.exports = member => {
  const embed = new Discord.RichEmbed();
  let logChannel = member.client.channels.find('name', config.logChannel);
  if (!logChannel) return console.log('Log Channel does not exist');
  let role = member.guild.roles.find('name', config.userRole);
  if (!role) return console.log('Member role does not exist');
  try {
    member.addRole(role);
  } catch(e) {
    console.log(e);
  }
  embed.setTitle('User Added');
  embed.setColor('#10A854');
  embed.setTimestamp();      embed.setDescription(`User ${member.user.username} has joined the server and has been added to the the ${role} role.`);
  member.client.channels.get(logChannel.id).sendEmbed(embed);
};

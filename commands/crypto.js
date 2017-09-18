var request = require('request');
const Discord = require('discord.js');

exports.run = function(client, message, args) {
  if (!args[0]){
    return message.channel.sendMessage('Please enter a search term.');
  }
  var embed = new Discord.RichEmbed();
  getCryptoData(args, message, function(cryptoData){
    embed.setTitle(`${cryptoData.ticker.base} to ${cryptoData.ticker.target}`);
    embed.setColor('#10A854');
    embed.addField('Price', `${cryptoData.ticker.price}`);
    embed.addField('Change', `${cryptoData.ticker.change}`);
    embed.setTimestamp();
    message.channel.sendEmbed(embed);
  });
};

function getCryptoData(args, message, callback) {
  request('https://api.cryptonator.com/api/ticker/' + args[0] + '-' + args[1], function(error, response, cryptoData) {
    if (error || response.statusCode != 200) {
      console.log(error);
      message.channel.sendMessage('There has been an error searching, please try again later.');
      return;
    }
    try{
      cryptoData = JSON.parse(cryptoData);
    } catch(e) {
      console.log(e);
      message.channel.sendMessage('There has been an error searching, please try again later.');
      return;
    }
    return callback(cryptoData);
  });
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'crypto',
  description: 'Get current cryptocurrency prices.',
  usage: 'crypto <cryptocurrency> <currency>'
};

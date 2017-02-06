const Discord = require('discord.js');
var request = require('request');
const green = '#008000';
const red = '#FF0000';
const yellow = '#FFD700';

exports.run = function(client, message, args){
  var embed = new Discord.RichEmbed();
  let url = `http://www.omdbapi.com/?t=${args[0]}&y=&plot=short&r=json`;
  request(url, function (error, response, filmData) {
    if (error) {
      return console.log(error);
    }
    if (response.statusCode != 200) {
      message.channel.sendMessage(`There has been an error. Response code: ${response.statusCode}`)
    }
    if (filmData == 'The service is unavailable.') {
      return message.channel.sendMessage('The service is unavailable.');
    }
    if (filmData.)
    filmData = JSON.parse(filmData);
    //embed.setTitle(filmData.Title);
    embed.setDescription
    embed.setColor(red);
    //embed.setURL(`http://www.imdb.com/title/${filmData.imdbID}/`);
    embed.setThumbnail(filmData.Poster);
    embed.addField('Genre', filmData.Genre);
    embed.addField('Rating', `${filmData.Metascore}   - Meta Score
${filmData.imdbRating}  - IMDB Rating`);
    embed.addField('Plot', filmData.Plot);

    message.channel.sendEmbed(embed);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'imdb',
  description: 'Search IMDB for film information',
  usage: 'imdb <film>'
};

var request = require('request');
exports.run = function(client, message, args){
  let url = `http://www.omdbapi.com/?t=${args[0]}&y=&plot=short&r=json`;
  request(url, function (error, response, filmData) {
    if (error) {
      return console.log(error);
    }
    if (response.statusCode != 200) {
      return console.log(response.statusCode);
    }
    console.log(filmData);
  });
};

exports.conf = {
  enabled: false,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'imdb',
  description: 'Search IMDB for film information',
  usage: 'imdb <film>'
};

const Discord = require('discord.js');
const config = require('../config.json');
var request = require('request');
const green = '#008000';
const red = '#FF0000';
const yellow = '#FFD700';

exports.run = function(client, message, args) {
  if (!args[0]){
      return message.channel.sendMessage('Please enter a search term.');
  }
  args = args.join(' ');
  var embed = new Discord.RichEmbed();
  var colour;
  getSearchData(args, function(searchData) {
    if (searchData.total_results == 0) {
      message.channel.sendMessage('Movie not found');
    } else {
      getFilmData(searchData.results[0].id, function(filmData) {
        if (parseFloat(filmData.vote_average)*10 >= 80){
          colour = green;
        } else if (parseFloat(filmData.vote_average)*10 >= 60 && parseFloat(filmData.vote_average)*10 < 80) {
          colour = yellow;
        }else if (parseFloat(filmData.vote_average)*10 < 60){
          colour = red;
        }

        embed.setDescription(`__**${filmData.title}**__`);
        embed.setColor(colour);
        embed.setThumbnail(`https://image.tmdb.org/t/p/w500${filmData.poster_path}`);
        embed.addField('Release Date', `${filmData.release_date}`);
        embed.addField('Runtime', `${filmData.runtime} minutes`);
        embed.addField('Rating', `${filmData.vote_average}  -  TheMovieDB User Score`);
        embed.addField('Plot', filmData.overview);

        message.channel.sendEmbed(embed);
      });
    }
  });
};

function getFilmData(filmID, callback) {
  var filmOptions = {
    method: 'GET',
    url: `https://api.themoviedb.org/3/movie/${filmID}`,
    qs: {
      language: 'en-US',
      api_key: config.tmdbKey
    },
    body: '{}'
  };

  request(filmOptions, function (error, response, filmData) {
    if (error || response.statusCode != 200) {
      console.log(error);
      message.channel.sendMessage('There has been an error searching, please try again later.');
      return;
    }
    try{
      filmData = JSON.parse(filmData);
    } catch(e) {
      console.log(e);
      message.channel.sendMessage('There has been an error searching, please try again later.');
      return;
    }
    return callback(filmData);
  });
}

function getSearchData(args, callback) {
  var searchOptions = {
    method: 'GET',
    url: 'https://api.themoviedb.org/3/search/movie',
    qs: {
      include_adult: 'false',
      page: '1',
      query: args,
      language: 'en-US',
      api_key: config.tmdbKey
    },
    body: '{}'
  };

  request(searchOptions, function (error, response, searchData) {
    if (error || response.statusCode != 200) {
      console.log(error);
      message.channel.sendMessage('There has been an error searching, please try again later.');
      return ;
    }
    try{
      searchData = JSON.parse(searchData);
    } catch(error) {
      console.log(error);
      message.channel.sendMessage('There has been an error searching, please try again later.');
      return;
    }
    return callback(searchData);
  });
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'movie',
  description: 'Search TheMovieDB for film information',
  usage: 'movie <film>'
};

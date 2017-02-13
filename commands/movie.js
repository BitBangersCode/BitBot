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
  var filmID;
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
    if (error) {
      console.log(error);
      message.channel.sendMessage('There has been an error searching, please try again later.');
      return ;
    }
    if (response.statusCode != 200) {
      console.log(response.statusCode);
      return message.channel.sendMessage('There has been an error searching, please try again later.');
    }
    try{
      searchData = JSON.parse(searchData);
    } catch(e) {
      console.log(e);
      message.channel.sendMessage('There has been an error searching, please try again later.');
      return;
    }
    if (searchData.total_results == 0) {
      message.channel.sendMessage('No movie found');
    } else {
      return filmID = searchData.results[0].id;
    }
  });

console.log(filmID);
  var filmOptions = {
    method: 'GET',
    url: `https://api.themoviedb.org/3/movie/${filmID}`,
    qs: {
      language: 'en-US',
      api_key: config.tmdbKey
    },
    body: '{}'
  };

  console.log(filmOptions);
  request(filmOptions, function (error, response, filmData) {
    if (error) {
      console.log(error);
      message.channel.sendMessage('There has been an error searching, please try again later.');
      return;
    }
    if (response.statusCode != 200) {
      console.log(response.statusCode);
      return message.channel.sendMessage('There has been an error searching, please try again later.');
    }
    try{
      filmData = JSON.parse(filmData);
    } catch(e) {
      console.log(e);
      message.channel.sendMessage('There has been an error searching, please try again later.');
      return;
    }
    if (parseFloat(filmData.vote_average)*10 >= 80){
      colour = green;
    }
    if (parseFloat(filmData.vote_average)*10 >= 60 && parseFloat(filmData.vote_average)*10 < 80) {
      colour = yellow;
    }
    if (parseFloat(filmData.vote_average)*10 < 60){
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
};

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

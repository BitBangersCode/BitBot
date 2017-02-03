const ballAnswers = require('../8ball.json');
exports.run = function(client, message, args){
  message.channel.sendMessage(ballAnswers[Math.floor(Math.random() * 20) +1]);
}

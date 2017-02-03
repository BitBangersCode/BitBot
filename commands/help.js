const config = require('../config.json');
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

exports.run = function(client, message, args){
  message.channel.sendMessage(helpMessage);
}

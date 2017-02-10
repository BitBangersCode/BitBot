const config = require('../config.json');

module.exports = client => {
  console.log('bot is ready');
  client.user.setGame(`${config.prefix}help`);
};

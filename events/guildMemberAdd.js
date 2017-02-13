const config = require('../config.json');

module.exports = member => {
  if ('userRole' in config) {
    role = member.guild.roles.find('name', config.userRole);
    try {
      member.addRole(role)
    } catch(e) {
      console.log(e);
    }
  }
};

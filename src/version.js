const {version} = require(`../package.json`);

module.exports = {
  name: `version`,
  description: `Show application version`,
  execute() {
    console.log(version);
  }
};

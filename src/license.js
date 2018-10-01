const {license} = require(`../package.json`);

module.exports = {
  name: `license`,
  description: `Show application license`,
  execute() {
    console.log(license);
  }
};

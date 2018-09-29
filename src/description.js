const {descripton} = require(`../package.json`);

module.exports = {
  name: `descripton`,
  descripton: `Show application description`,
  execute() {
    console.log(descripton);
  }
};

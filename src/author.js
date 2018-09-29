const {author} = require(`../package.json`);

module.exports = {
  name: `author`,
  description: `Show application author`,
  execute() {
    console.log(author);
  }
};

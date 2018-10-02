const {author, name} = require(`../package.json`);
const colors = require(`colors/safe`);

module.exports = {
  name: `welcome`,
  description: `Show welcome message`,
  execute() {
    console.log(`Привет пользователь!
Эта программа будет запускать сервер «${colors.rainbow(name)}».
Автор: ${author}.`);
  }
};

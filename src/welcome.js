const {author, name} = require(`../package.json`);

module.exports = {
  name: `welcome`,
  description: `Show welcome message`,
  execute() {
    console.log(`Привет пользователь!
Эта программа будет запускать сервер «${name}».
Автор: ${author}.`);
  }
};

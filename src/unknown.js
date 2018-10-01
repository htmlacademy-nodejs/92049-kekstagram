const colors = require(`colors/safe`);

module.exports = {
  name: `unknown`,
  description: `Show message for unknown command and a tip for help`,
  execute(command) {
    console.error(`Неизвестная команда ${colors.red(command)}.
Чтобы прочитать правила использования приложения, наберите "${colors.gray(`--help`)}"`);
  }
};

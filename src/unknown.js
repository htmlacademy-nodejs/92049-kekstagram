module.exports = {
  name: `unknown`,
  description: `Show message for unknown command and a tip for help`,
  execute(command) {
    console.error(`Неизвестная команда ${command}.
Чтобы прочитать правила использования приложения, наберите "--help"`);
  }
};

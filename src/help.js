module.exports = {
  name: `help`,
  description: `Show help message`,
  execute() {
    console.log(`Доступные команды:
--help    — печатает этот текст;
--version — печатает версию приложения;`);
  }
};

class Messages {
  static getWelcome(application) {
    return `Привет пользователь!
    Эта программа будет запускать сервер «${application}».
    Автор: Артамонов Евгений.`;
  }

  static getUnknownCommand(command) {
    return `Неизвестная команда ${command}.
    Чтобы прочитать правила использования приложения, наберите "--help"`;
  }

  static getVersion() {
    return `v0.0.1`;
  }

  static HELP() {
    return `Доступные команды:
    --help    — печатает этот текст;
    --version — печатает версию приложения;`;
  }
}

const Commands = {
  "--help": `getWelcome`,
  "--version": `getUnknownCommand`
};

const handleCommand = (command) => {
  const commandKey = Commands[command];

  if (commandKey) {
    console.log(Messages[commandKey](command));
  } else {
    console.error(Messages.getUnknownCommand(command));
    process.exit(1);
  }
};

const handleCommands = () => {
  const {argv} = process;
  const commands = argv.slice(2);
  const application = __dirname.split(`/`).pop();

  if (!commands.length) {
    console.log(Messages.getWelcome(application));
  }

  commands.forEach(handleCommand);
};

handleCommands();

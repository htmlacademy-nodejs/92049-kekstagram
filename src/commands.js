const commandModules = [
  require(`./version.js`),
  require(`./help`),
  require(`./license`),
  require(`./author`)
];
const welcome = require(`./welcome`);
const unknown = require(`./unknown`);

const handleCommand = (command) => {
  const commandModule = commandModules.find(
      (module) => `--${module.name}` === command
  );
  if (commandModule) {
    commandModule.execute(command);
  } else {
    unknown.execute(command);
    process.exit(1);
  }
};

const handleCommands = () => {
  const {argv} = process;
  const commands = argv.slice(2);

  if (!commands.length) {
    welcome.execute();
    process.exit(0);
  }

  commands.forEach(handleCommand);
};

handleCommands();

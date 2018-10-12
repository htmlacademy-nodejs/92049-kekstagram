const {commandModules} = require(`./help`);
const welcome = require(`./welcome`);
const unknown = require(`./unknown`);
const makeDialog = require(`./dialogs`);


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
    makeDialog.execute();
  } else {
    commands.forEach(handleCommand);
  }
};

module.exports = handleCommands;

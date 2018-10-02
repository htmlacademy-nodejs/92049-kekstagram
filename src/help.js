const commandModules = [
  require(`./version.js`),
  require(`./license`),
  require(`./author`)
];
const colors = require(`colors/safe`);

const helpModule = {
  name: `help`,
  description: `Show help message`,
  execute() {
    const availableCommands = this.commandModules
      .map(
          (module) =>
            `--${colors.gray(module.name).padEnd(20, ` `)} — ${colors.green(
                module.description
            )}`
      )
      .join(`\n`);

    console.log(`Available commands:
${availableCommands}`);
  }
};

const fullCommandModules = commandModules.concat(helpModule);

helpModule.commandModules = fullCommandModules;

module.exports = helpModule;

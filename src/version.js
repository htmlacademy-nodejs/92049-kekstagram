const {version} = require(`../package.json`);
const colors = require(`colors/safe`);

module.exports = {
  name: `version`,
  description: `Show application version`,
  execute() {
    const coloredVersion = version
      .split(`.`)
      .map((it, index) => {
        if (index === 0) {
          return colors.red(it);
        }
        if (index === 1) {
          return colors.green(it);
        }
        return colors.blue(it);
      })
      .join(`.`);
    console.log(`v${coloredVersion}`);
  }
};

const fs = require(`fs`);
const entityGenerator = require(`./entity-generator`);
const {exitCorrectly, getYesOrNoDialog} = require(`./utils`);

const writeFile = (path, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
};

const checkFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.access(path, (error) => {
      if (error) {
        if (error.code === `ENOENT`) {
          return resolve();
        }
        return reject(error);
      }

      return reject();
    });
  });
};

module.exports = {
  execute: (readline, quantity, path = `entities.json`) => {
    return new Promise(() => {
      const data = Array.from({length: quantity}).map(() =>
        JSON.stringify(entityGenerator.execute())
      );

      checkFile(path)
        .catch(() => getYesOrNoDialog(readline, `Вы хотите перезаписать файл?`))
        .catch(exitCorrectly)
        .then(() => writeFile(path, data))
        .then(() => {
          readline.setPrompt(`Файл был успешно сохранен!`);
          readline.prompt();
          readline.close();
          exitCorrectly();
        })
        .catch((error) => {
          console.error(error);
          process.exit(1);
        });
    });
  }
};

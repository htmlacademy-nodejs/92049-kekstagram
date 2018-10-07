const readline = require(`readline`);
const fs = require(`fs`);
const {showYesOrNoDialog} = require(`./utils`);
const entityGenerator = require(`./entity-generator`);
const DEFAULT_PATH = `entities.json`;

const sayBay = () => console.log(`Пока!`);

const createDialog = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  showYesOrNoDialog(rl, `Сгенерировать данные? `)
    .then(showElementQuantityDialog)
    .catch(() => {
      rl.close();
      sayBay();
    });
};

const showElementQuantityDialog = (rl) => {
  const handler = (line) => {
    const preparedAnswer = Number(line);
    if (Number.isInteger(preparedAnswer) && preparedAnswer > 0) {
      rl.removeListener(`line`, handler);
      showPathDialog(rl, preparedAnswer);
    } else {
      console.log(`Должно быть целое положительное число`);
      rl.prompt();
    }
  };

  rl.setPrompt(`Введите количество элементов `);
  rl.prompt();
  rl.on(`line`, handler);
};

const showPathDialog = (rl, quantity) => {
  const handler = (path) => {
    checkPath(rl, path ? path : DEFAULT_PATH, quantity);
  };
  rl.setPrompt(`Укажите путь к файлу(${DEFAULT_PATH}) `);
  rl.prompt();
  rl.on(`line`, handler);
};

const checkPath = (rl, path, quantity) => {
  fs.open(path, `wx`, (error, fd) => {
    if (error) {
      if (error.code === `EEXIST`) {
        showYesOrNoDialog(rl, `Файл существует, перезаписать?`)
          .then(() => {
            console.log(`--------`);
            writeFile(rl, path, quantity);
          });
        return;
      }

      if (error.code === `ENOENT`) {
        console.log(`Некорректный путь`);
        showPathDialog(rl, path, quantity);
        return;
      }

      throw error;
    }
    fs.close(fd, () => {
      writeFile(rl, path, quantity);
    });
  });
};

const writeFile = (rl, path, quantity) => {
  const data = Array.from({length: quantity}).map(() =>
    JSON.stringify(entityGenerator.execute())
  );

  fs.writeFile(path, data, (error) => {
    console.log(path);
    if (error) {
      throw error;
    }
    rl.setPrompt(`Файл успешно записан`);
    rl.prompt();
    rl.close();
    sayBay();
  });
};

module.exports = {
  execute: createDialog
};

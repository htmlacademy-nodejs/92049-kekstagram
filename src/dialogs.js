const Readline = require(`readline`);
const fs = require(`fs`);
const entityGenerator = require(`./entity-generator`);
const DEFAULT_PATH = `entities.json`;
const DEFAULT_QUANTITY = 1;

const readline = Readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let quantity;
let path;

const yesOrNo = (prompt, cbYes, cbNo) => {
  const handler = (line) => {
    const preparedLine = line.toLowerCase().trim();
    switch (preparedLine) {
      case `y`:
        readline.removeListener(`line`, handler);
        cbYes();
        break;
      case `n`:
        cbNo();
        break;
      default:
        console.log(`Наберите "Y" или "N"`);
        readline.prompt();
    }
  };
  readline.setPrompt(prompt);
  readline.prompt();
  readline.on(`line`, handler);
};

const sayBye = () => {
  readline.close();
  console.log(`Пока!`);
};

const createDialog = () => {
  yesOrNo(`Сгенерировать данные? `, showQuantityDialog, sayBye
  );
};

const showQuantityDialog = () => {
  const handler = (line) => {
    const preparedLine = Number(line ? line : DEFAULT_QUANTITY);

    if (Number.isInteger(preparedLine) && preparedLine > 0) {
      quantity = preparedLine;
      readline.removeListener(`line`, handler);
      showPathDialog();
    } else {
      console.log(`Введите целое положительное число`);
      readline.prompt();
    }
  };

  readline.setPrompt(`Введите количество (${DEFAULT_QUANTITY})`);
  readline.prompt();
  readline.on(`line`, handler);
};

const showPathDialog = () => {
  const handler = (line) => {
    path = line ? line : DEFAULT_PATH;
    checkPath(writeFile, showWrongPathDialog, showRewrightDialog);
    readline.removeListener(`line`, handler);
  };

  readline.setPrompt(`Укажите файл(${DEFAULT_PATH}) `);
  readline.prompt();
  readline.on(`line`, handler);
};

const checkPath = (correctCb, incorrectCb, existCb) => {
  fs.open(path, `wx`, (error, fd) => {
    if (error) {
      if (error.code === `ENOENT`) {
        incorrectCb();
        return;
      }

      if (error.code === `EEXIST`) {
        existCb();
        return;
      }

      throw error;
    }

    fs.close(fd, correctCb);
  });
};

const showWrongPathDialog = () => {
  console.log(`Указан некорректный путь`);
  showPathDialog();
};

const writeFile = () => {
  const data = JSON.stringify(Array.from({length: quantity}).map(entityGenerator.execute));
  fs.writeFile(path, data, (error)=> {
    if (error) {
      throw error;
    }

    console.log(`Файл ${path} сохранен!`);
    readline.close();
  });
};

const showRewrightDialog = () => {
  yesOrNo(`Файл существует. Переписать?`, writeFile, sayBye);
};


module.exports = {
  execute: createDialog
};

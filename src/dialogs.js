const Readline = require(`readline`);
const fs = require(`fs`);
const entityGenerator = require(`./entity-generator`);
const DEFAULT_PATH = `entities.json`;
const DEFAULT_QUANTITY = 1;
const PathInputAnswers = {
  CORRECT: `correct`,
  EXIST: `exist`,
  WRONG: `wrong`
};

const readline = Readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let quantity;
let path;

const yesOrNo = (prompt, cb) => {
  const handler = (line) => {
    const preparedLine = line.toLowerCase().trim();
    switch (preparedLine) {
      case `y`:
        readline.removeListener(`line`, handler);
        cb(true);
        break;
      case `n`:
        cb(false);
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
  yesOrNo(`Сгенерировать данные? `, showQuantityDialog);
};

const showQuantityDialog = (answer) => {
  if (!answer) {
    return sayBye();
  }

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
    checkPath(handlePathInput);
    readline.removeListener(`line`, handler);
  };

  readline.setPrompt(`Укажите файл(${DEFAULT_PATH}) `);
  readline.prompt();
  readline.on(`line`, handler);
};

const checkPath = (cb) => {
  fs.open(path, `wx`, (error, fd) => {
    if (error) {
      if (error.code === `ENOENT`) {
        cb(PathInputAnswers.WRONG);
        return;
      }

      if (error.code === `EEXIST`) {
        cb(PathInputAnswers.EXIST);
        return;
      }

      throw error;
    }

    fs.close(fd, () => cb(PathInputAnswers.CORRECT));
  });
};

const handlePathInput = (answer) => {
  switch (answer) {
    case PathInputAnswers.CORRECT:
      writeFile();
      break;
    case PathInputAnswers.WRONG:
      showWrongPathDialog();
      break;
    case PathInputAnswers.EXIST:
      showRewrightDialog();
  }
};

const showWrongPathDialog = () => {
  console.log(`Указан некорректный путь`);
  showPathDialog();
};

const writeFile = () => {
  const data = JSON.stringify(
      Array.from({length: quantity}).map(entityGenerator.execute)
  );
  fs.writeFile(path, data, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Файл ${path} сохранен!`);
    readline.close();
  });
};

const handleRewrightInput = (answer) => {
  if (!answer) {
    return sayBye();
  }

  writeFile();
};

const showRewrightDialog = () => {
  yesOrNo(`Файл существует. Переписать?`, handleRewrightInput);
};

module.exports = {
  execute: createDialog
};

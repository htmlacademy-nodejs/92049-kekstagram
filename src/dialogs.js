const readline = require(`readline`);
const generate = require(`./generate`);
const {getYesOrNoDialog} = require(`./utils`);

const createDialog = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  getYesOrNoDialog(rl, `Сгенерировать данные? `)
    .then(setElementQuantityDialog)
    .catch(() => process.exit(0));
};

const setElementQuantityDialog = (rl) => {
  const handler = (line) => {
    const preparedAnswer = Number(line);
    if (Number.isInteger(preparedAnswer) && preparedAnswer > 0) {
      rl.removeListener(`line`, handler);
      setPathDialog(rl, preparedAnswer);
    } else {
      console.log(`Должно быть целое положительное число`);
      rl.prompt();
    }
  };

  rl.setPrompt(`Введите количество элементов `);
  rl.prompt();
  rl.on(`line`, handler);
};

const setPathDialog = (rl, quantity) => {
  const handler = (path) => {
    generate.execute(rl, quantity, path ? path : undefined);
  };
  rl.setPrompt(`Укажите путь к файлу `);
  rl.prompt();
  rl.on(`line`, handler);
};

module.exports = {
  execute: createDialog
};

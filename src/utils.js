const ALFABET_START_CODE = 97;
const ALFABET_END_CODE = 122;
const MIN_WORD_LENGTH = 3;
const MAX_WORD_LENGTH = 8;

const getRandomInteger = (max, min = 0) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomLetter = () => {
  const unicode = getRandomInteger(ALFABET_END_CODE, ALFABET_START_CODE);

  return String.fromCharCode(unicode);
};

const getRandomWord = (maxLength, minLength = 1) => {
  const length = getRandomInteger(maxLength, minLength);

  return Array.from({length}).map(() => getRandomLetter()).join(``);
};

const getRandomString = (maxLength) => {
  let string = ``;
  let word = ``;

  while (string.concat(word).length <= maxLength) {
    string += word;
    word = ` ${getRandomWord(MAX_WORD_LENGTH, MIN_WORD_LENGTH)}`;
  }

  return string;
};

const exitCorrectly = () => process.exit(0);

module.exports = {
  getRandomInteger,
  getRandomWord,
  getRandomString,
  exitCorrectly
};

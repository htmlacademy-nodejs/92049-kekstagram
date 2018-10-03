const {
  effects,
  HASHTAG_MAX_QNT,
  HASHTAG_MAX_LENGTH,
  MAX_SCALE,
  MAX_STRING_LENGTH,
  MAX_COMMENT_QNT,
  WEEK
} = require(`./constants`);
const {getRandomInteger, getRandomWord, getRandomString} = require(`./utils`);

const generateHashtags = () => {
  return new Array(getRandomInteger(HASHTAG_MAX_QNT))
    .fill(``)
    .reduce((acc) => {
      let hashtag;

      do {
        hashtag = getRandomWord(HASHTAG_MAX_LENGTH - 1);
      } while (acc.includes(hashtag));

      acc.push(`#${hashtag}`);

      return acc;
    }, []);
};

const generateComments = () => {
  return new Array(getRandomInteger(MAX_COMMENT_QNT))
    .fill(``)
    .map(() => getRandomString(MAX_STRING_LENGTH));
};

const generateDate = () => {
  const date = Date.now();

  return getRandomInteger(date, date - WEEK);
};

const generateEntity = () => {
  return {
    url: `https://picsum.photos/600/?random`,
    scale: getRandomInteger(MAX_SCALE),
    effect: effects[getRandomInteger(effects.length - 1)],
    hashtags: generateHashtags(),
    description: getRandomString(MAX_STRING_LENGTH),
    likes: getRandomInteger(1000),
    comments: generateComments(),
    date: generateDate()
  };
};

module.exports = generateEntity;

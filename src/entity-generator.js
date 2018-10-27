const {
  EFFECTS,
  HASHTAG_MAX_QNT,
  HASHTAG_MAX_LENGTH,
  MAX_SCALE,
  MAX_STRING_LENGTH,
  MAX_COMMENT_QNT,
  WEEK
} = require(`./constants`);
const {getRandomInteger, getRandomWord, getRandomString} = require(`./utils`);

const generateHashtags = () => {
  return Array.from({length: HASHTAG_MAX_QNT})
    .reduce((acc) => {
      let hashtag;

      do {
        hashtag = getRandomWord(HASHTAG_MAX_LENGTH - 1);
      } while (acc.includes(hashtag));

      acc.push(`#${hashtag}`);

      return acc;
    }, []).join(` `);
};

const generateComments = () => {
  return Array.from({length: MAX_COMMENT_QNT})
    .map(() => getRandomString(MAX_STRING_LENGTH));
};

const generateDate = () => {
  const date = Date.now();

  return getRandomInteger(date, date - WEEK);
};

const generateEntity = () => {
  return {
    filename: {mimetype: `image/jpg`},
    url: `https://picsum.photos/600/?random`,
    scale: getRandomInteger(MAX_SCALE),
    effect: EFFECTS[getRandomInteger(EFFECTS.length - 1)],
    hashtags: generateHashtags(),
    description: getRandomString(MAX_STRING_LENGTH),
    likes: getRandomInteger(1000),
    comments: generateComments(),
    date: generateDate()
  };
};

module.exports = {
  execute: generateEntity
};

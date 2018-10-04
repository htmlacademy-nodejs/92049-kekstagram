const assert = require(`assert`);
const generateEntity = require(`../src/entity-generator`);
const {
  EFFECTS,
  MAX_SCALE,
  HASHTAG_MAX_LENGTH,
  HASHTAG_MAX_QNT,
  MAX_STRING_LENGTH,
  WEEK
} = require(`../src/constants`);

describe(`Function generateEntity`, () => {
  it(`has url with link to random image`, () => {
    assert.equal(generateEntity().url, `https://picsum.photos/600/?random`);
  });

  it(`has one of effects`, () => {
    assert(EFFECTS.includes(generateEntity().effect));
  });

  it(`has scale`, () => {
    const {scale} = generateEntity();
    assert(scale >= 0 && scale < MAX_SCALE);
  });

  it(`has hashtags`, () => {
    const {hashtags} = generateEntity();

    assert(hashtags.every((it) => it[0] === `#`));
    assert(
        hashtags.every((it) => it.length > 0 && it.length <= HASHTAG_MAX_LENGTH)
    );
    assert(hashtags.length <= HASHTAG_MAX_QNT && hashtags.length >= 0);
    assert(hashtags.every((it) => !it.includes(` `) && it.length > 1));
  });

  it(`has description`, () => {
    const {description} = generateEntity();

    assert(description.length <= MAX_STRING_LENGTH && description.length > 0);
  });

  it(`has comments`, () => {
    const {comments} = generateEntity();

    assert(comments.every((comment) => comment.length <= MAX_STRING_LENGTH));
  });

  it(`has date`, () => {
    const now = Date.now();
    const {date} = generateEntity();

    assert(date <= now && date >= now - WEEK);
  });
});


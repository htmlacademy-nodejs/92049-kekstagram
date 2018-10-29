const {
  EFFECTS,
  HASHTAG_MAX_LENGTH,
  HASHTAG_MAX_QNT,
  MAX_SCALE,
  MAX_STRING_LENGTH
} = require(`./constants`);
const ValidationError = require(`./errors/validation-error`);

const validate = (data) => {
  const {filename, scale, effect, hashtags, description} = data;
  const errors = [];
  const addRequiredError = (fieldName) => {
    errors.push({
      error: `Validation Error`,
      fieldName,
      errorMessage: `поле обязательно`
    });
  };

  const addError = (fieldName, errorMessage) => {
    errors.push({error: `Validation Error`, fieldName, errorMessage});
  };

  if (!filename) {
    addRequiredError(`filename`);
  } else {
    if (!(/image/).test(filename.mimetype)) {
      addError(`filename`, `Неверный тип файла`);
    }
  }

  if (!scale) {
    addRequiredError(`scale`);
  } else if (scale < 0 || scale > MAX_SCALE) {
    addError(`scale`, `должно быть число в дипазоне 0-100`);
  }

  if (!effect) {
    addRequiredError(`effect`);
  } else {
    const invalid = !EFFECTS.some((it) => it === effect);
    if (invalid) {
      addError(
          `effect`,
          `значение не из 'none', 'chrome', 'sepia', 'marvin', 'phobos', 'heat'`
      );
    }
  }

  if (hashtags) {
    const hashtagArray = hashtags.split(` `);

    const wrongLength = !hashtagArray.every(
        (it) => it.length >= 1 && it.length <= HASHTAG_MAX_LENGTH
    );
    if (wrongLength) {
      addError(`hashtag`, `длинна хештегов от 1 до 20 символов`);
    }

    const maxNumber = hashtagArray.length > HASHTAG_MAX_QNT;
    if (maxNumber) {
      addError(`hashtag`, `Максимальноче количество хештегов - 5`);
    }

    const withoutHash = !hashtagArray.every((it) => it.startsWith(`#`));
    if (withoutHash) {
      addError(`hashtag`, `хештеги должны начинаться с решетки`);
    }

    const notUniq = new Set(hashtagArray).size !== hashtagArray.length;
    if (notUniq) {
      addError(`hashtag`, `хештеги не должны повторяться`);
    }

    const notSplitted = hashtagArray.some((it) => it.includes(`#`, 1));
    if (notSplitted) {
      addError(`hashtag`, `хештеги должны быть разделены пробелом`);
    }
  }

  if (description && description.length > MAX_STRING_LENGTH) {
    addError(`description`, `длина не больше 140 символов`);
  }

  if (errors.length) {
    console.log(errors);

    throw new ValidationError(errors);
  }

  return data;
};

module.exports = validate;

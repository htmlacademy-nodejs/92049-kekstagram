const {createLogger, format, transports} = require(`winston`);
const {json, simple, combine, timestamp} = format;
const {Console, File} = transports;

const stack = format((info) => {
  if (info instanceof Error) {
    return Object.assign({}, info, {
      stack: info.stack,
      message: info.message
    });
  }

  return info;
});
const logger = createLogger({
  level: `info`,
  format: combine(stack(), json()),
  transports: [
    new File({filename: `logs/error.log`, level: `error`}),
    new File({filename: `logs/combined.log`})
  ]
});

if (process.env.NODE_ENV !== `production`) {
  logger.add(
      new Console({
        level: `silly`,
        format: combine(stack(), timestamp(), simple())
      })
  );
}

module.exports = logger;

const logger = require(`./logger`);
const express = require(`express`);
const http = require(`http`);
const {postsRouter: makePostsRouter} = require(`./posts/router`);

const notFoundHandler = (req, res) => {
  res.status(404).send(`Page not found`);
};

const {SERVER_PORT = 3000, SERVER_HOST = `localhost`} = process.env;

const init = (storeOfData, storeOfImages) => {
  const app = express();
  const postsRouter = makePostsRouter(storeOfData, storeOfImages);
  app.use(express.static(`${__dirname}/../static`));
  app.use(`/api/posts`, postsRouter);

  app.use(notFoundHandler);

  app.use((error, req, res, _next) => {
    if (error) {
      logger.error(error);
      const {code = 500, message} = error;

      res.status(code).send([
        {
          error: http.STATUS_CODES[code],
          errorMessage: message
        }
      ]);
    }
  });

  return app;
};

module.exports = {
  name: `server`,
  description: `Run server on 3000 port by default`,
  execute: (command, port = SERVER_PORT) => {
    const imageStore = require(`./images/store`);
    const postsStore = require(`./posts/store`);

    init(postsStore, imageStore).listen(port, SERVER_HOST, () =>
      logger.info(`Server running at http://${SERVER_HOST}:${port}`)
    );
  },
  init
};

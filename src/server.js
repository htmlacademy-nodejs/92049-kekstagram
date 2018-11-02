const express = require(`express`);
const http = require(`http`);
const {postsRouter: makePostsRouter} = require(`./posts/router`);
const imageStore = require(`./images/store`);
const postsStore = require(`./posts/store`);

const notFoundHandler = (req, res) => {
  res.status(404).send(`Page not found`);
};

const DEFAULT_PORT = 3000;
const HOST = `127.0.0.1`;

const init = (storeOfData, storeOfImages) => {
  const app = express();
  const postsRouter = makePostsRouter(storeOfData, storeOfImages);
  app.use(express.static(`${__dirname}/../static`));
  app.use(`/api/posts`, postsRouter);

  app.use(notFoundHandler);

  app.use((error, req, res, _next) => {
    if (error) {
      console.error(error);
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
  execute: (command, port = DEFAULT_PORT) => {
    init(postsStore, imageStore).listen(port, HOST, () =>
      console.log(`Server running at http://${HOST}:${port}`)
    );
  },
  init
};

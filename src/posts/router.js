const express = require(`express`);
const multer = require(`multer`);
const IllegalArgumentError = require(`../errors/illegal-argument-error`);
const NotFoundError = require(`../errors/not-found-error`);
const ValidationError = require(`../errors/validation-error`);
const {Router} = express;
const jsonParser = express.json();
const upload = multer({storage: multer.memoryStorage()});
const validate = require(`../validate`);
const toStream = require(`buffer-to-stream`);

const DEFAULT_POSTS_LIMIT = 50;
const DEFAULT_SKIP = 0;

const postsRouter = new Router();

const asyncMiddleware = (fn) => (req, res, next) =>
  fn(req, res, next).catch(next);

const toPage = async (cursor, skip, limit) => {
  const data = await cursor
    .skip(skip)
    .limit(limit)
    .toArray();

  return {
    data,
    skip,
    limit,
    total: await cursor.count()
  };
};

postsRouter.get(
    ``,
    asyncMiddleware(async (req, res) => {
      const {limit = DEFAULT_POSTS_LIMIT, skip = DEFAULT_SKIP} = req.query;
      const limitNumber = parseInt(limit, 10);
      const skipNumber = parseInt(skip, 10);
      if (isNaN(limitNumber) || isNaN(skipNumber)) {
        throw new IllegalArgumentError(`Неверные параметры skip или limit`);
      }

      res.send(
          await toPage(
              await postsRouter.postsStore.getPosts(),
              skipNumber,
              limitNumber
          )
      );
    })
);

postsRouter.get(
    `/:date`,
    asyncMiddleware(async (req, res) => {
      const date = Number(req.params.date);

      if (!date) {
        throw new IllegalArgumentError(`В запросе не указана дата`);
      }

      const post = await postsRouter.postsStore.getPost(date);

      if (!post) {
        throw new NotFoundError(`Пост с датой ${date}  не найден`);
      }

      res.send(post);
    })
);

postsRouter.get(
    `/:date/image`,
    asyncMiddleware(async (req, res) => {
      const date = Number(req.params.date);

      if (!date) {
        throw new IllegalArgumentError(`В запросе не указана дата`);
      }

      const post = await postsRouter.postsStore.getPost(date);

      if (!post) {
        throw new NotFoundError(`Пост с датой ${date}  не найден`);
      }

      const image = await postsRouter.imageStore.get(post._id);
      res.header(`Content-Type`, `image/jpg`);
      res.header(`Content-Length`, image.info.length);

      res.on(`error`, (e) => console.error(e));
      res.on(`end`, () => res.end());
      const stream = image.stream;
      stream.on(`error`, (e) => console.error(e));
      stream.on(`end`, () => res.end());
      stream.pipe(res);
    })
);

postsRouter.post(
    ``,
    jsonParser,
    upload.single(`image`),
    asyncMiddleware(async (req, res) => {
      const {body, file} = req;

      if (file) {
        const {mimetype} = file;
        body.filename = {
          mimetype
        };
      }

      const validated = validate(body);
      const result = await postsRouter.postsStore.savePost(
          Object.assign(validated, {date: Date.now()})
      );
      const insertedId = result.insertedId;

      if (file) {
        await postsRouter.imageStore.save(insertedId, toStream(file.buffer));
      }

      res.send(validated);
    })
);

postsRouter.use((error, req, res, next) => {
  if (error instanceof ValidationError) {
    const {code, errors} = error;
    res.status(code).json(errors);
    return;
  }

  next(error, req, res);
});

module.exports = {
  postsRouter: (postsStore, imageStore) => {
    postsRouter.postsStore = postsStore;
    postsRouter.imageStore = imageStore;

    return postsRouter;
  },
  DEFAULT_POSTS_LIMIT
};

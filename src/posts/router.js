const express = require(`express`);
const multer = require(`multer`);
const IllegalArgumentError = require(`../errors/illegal-argument-error`);
const NotFoundError = require(`../errors/not-found-error`);
const postGenerator = require(`../entity-generator`);
const {Router} = express;
const jsonParser = express.json();
const upload = multer({storage: multer.memoryStorage()});


const POST_MUMBER = 100;
const DEFAULT_POSTS_LIMIT = 50;
const DEFAULT_SKIP = 0;

const postsRouter = new Router();
const posts = Array.from({length: POST_MUMBER}).map(() =>
  postGenerator.execute()
);

postsRouter.get(``, (req, res) => {
  const {limit = DEFAULT_POSTS_LIMIT, skip = DEFAULT_SKIP} = req.query;
  const limitNumber = Number(limit);
  const skipNumber = Number(skip);


  res.send(posts.slice(skipNumber, skipNumber + limitNumber));
});

postsRouter.get(`/:date`, (req, res) => {
  const date = Number(req.params.date);

  if (!date) {
    throw new IllegalArgumentError(`В запросе не указана дата`);
  }

  const post = posts.find((it) => it.date === date);

  if (!post) {
    throw new NotFoundError(`Пост с датой ${date}  не найден`);
  }

  res.send(post);
});

postsRouter.post(``, jsonParser, upload.single(`image`), (req, res) => {
  const body = req.body;
  res.send(body);
});

module.exports = {
  postsRouter,
  posts,
  DEFAULT_POSTS_LIMIT
};

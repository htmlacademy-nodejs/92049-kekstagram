const assert = require(`assert`);
const request = require(`supertest`);
const {init} = require(`../src/server`);
const imageStoreMock = require(`./mock/image-store-mock`);
const {postsStoreMock, posts} = require(`./mock/posts-store-mock`);
const app = init(postsStoreMock, imageStoreMock);
const testPost = posts[0];
testPost.filename = {mimetype: `image/jpg`};

const {description, effect, hashtags, scale} = testPost;

describe(`POST /api/posts`, () => {
  it(`sends post as json`, async () => {
    const response = await request(app)
      .post(`/api/posts`)
      .send(testPost)
      .set(`Accept`, `application/json`)
      .set(`Content-Type`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    delete response.body.date;
    delete testPost.date;

    assert.deepEqual(testPost, response.body);
  });

  it(`sends post as form-data`, async () => {
    const response = await request(app)
      .post(`/api/posts`)
      .field(`description`, description)
      .field(`effect`, effect)
      .field(`hashtags`, hashtags)
      .field(`scale`, scale)
      .attach(`image`, `test/fixtures/car.jpeg`)
      .set(`Accept`, `application/json`)
      .set(`Content-Type`, `multipart/form-data`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    assert.deepEqual(testPost.description, response.body.description);
  });

  it(`sends post without required fields`, async () => {
    const emptyObject = {};
    const REQUIRED_FIELD_AMOUNT = 3;

    const response = await request(app)
      .post(`/api/posts`)
      .send(emptyObject)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Content-Type`, /json/);

    assert.equal(
        response.body.every((err) => err.error === `Validation Error`),
        true
    );
    assert.equal(response.body.length, REQUIRED_FIELD_AMOUNT);
  });

  it(`sends post with repeating hashtags`, async () => {
    const post = Object.assign({}, testPost);
    post.hashtags = `#same #same #one #two #three`;

    const response = await request(app)
      .post(`/api/posts`)
      .send(post)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Content-Type`, /json/);

    assert.equal(response.body.length, 1);
  });

  it(`sends post with extra hashtags`, async () => {
    const post = Object.assign({}, testPost);
    post.hashtags = `#one #two #three #four #five #six`;

    const response = await request(app)
      .post(`/api/posts`)
      .send(post)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Content-Type`, /json/);

    assert.equal(response.body.length, 1);
  });

  it(`sends post with extra hashtags`, async () => {
    const post = Object.assign({}, testPost);
    post.hashtags = `#one #two #three #four #five #six`;

    const response = await request(app)
      .post(`/api/posts`)
      .send(post)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Content-Type`, /json/);

    assert.equal(response.body.length, 1);
  });

  it(`sends post with hashtag without #`, async () => {
    const post = Object.assign({}, testPost);
    post.hashtags = `one #two #three #four #five`;

    const response = await request(app)
      .post(`/api/posts`)
      .send(post)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Content-Type`, /json/);

    assert.equal(response.body.length, 1);
  });

  it(`sends post with hashtag without space between items`, async () => {
    const post = Object.assign({}, testPost);
    post.hashtags = `#one#two #three #four #five`;

    const response = await request(app)
      .post(`/api/posts`)
      .send(post)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Content-Type`, /json/);

    assert.equal(response.body.length, 1);
  });

  it(`sends post with long description`, async () => {
    const post = Object.assign({}, testPost);
    post.description = Array.from({length: 142}).join(`a`);

    const response = await request(app)
      .post(`/api/posts`)
      .send(post)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Content-Type`, /json/);

    assert.equal(response.body.length, 1);
  });
});

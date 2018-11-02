const {init} = require(`../src/server`);

const assert = require(`assert`);
const request = require(`supertest`);
const imageStoreMock = require(`./mock/image-store-mock`);
const {postsStoreMock, posts} = require(`./mock/posts-store-mock`);
const {DEFAULT_POSTS_LIMIT} = require(`../src/posts/router`);
const app = init(postsStoreMock, imageStoreMock);

describe(`GET /api/posts`, () => {
  it(`respond with json`, async () => {
    const response = await request(app)
      .get(`/api/posts`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/);
    const {body} = response;
    assert.equal(body.data.length, DEFAULT_POSTS_LIMIT);
  });

  it(`get data from unknown resource`, async () => {
    return request(app)
      .get(`/api/unknownresource`)
      .set(`Accept`, `application/json`)
      .expect(404)
      .expect(`Page not found`)
      .expect(`Content-Type`, /html/);
  });

  it(`get data with limit`, async () => {
    const LIMIT = 10;
    const response = await request(app)
      .get(`/api/posts?limit=${LIMIT}`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/);
    const {data} = response.body;
    assert.equal(data.length, LIMIT);
    assert.equal(posts[LIMIT - 1].date, data[LIMIT - 1].date);
  });

  it(`get data with skiped items`, async () => {
    const SKIP = 10;
    const response = await request(app)
      .get(`/api/posts?skip=${SKIP}`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/);
    const {data} = response.body;
    assert.equal(data.length, DEFAULT_POSTS_LIMIT);
    assert.equal(posts[SKIP + DEFAULT_POSTS_LIMIT - 1].date, data[DEFAULT_POSTS_LIMIT - 1].date);
  });
});

describe(`GET /api/posts/:date`, () => {
  it(`get post with date`, async () => {
    const testDate = posts[0].date;
    const response = await request(app)
      .get(`/api/posts/${testDate}`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/);
    const post = response.body;

    assert.equal(testDate, post.date);
  });

  it(`get data from wrong date`, async () => {
    const THREE_WEEK = 1000 * 60 * 60 * 24 * 7 * 3;

    return request(app)
      .get(`/api/posts/${Date.now() - THREE_WEEK}`)
      .set(`Accept`, `application/json`)
      .expect(404)
      .expect(`Content-Type`, /json/);
  });
});

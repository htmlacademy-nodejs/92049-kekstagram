const assert = require(`assert`);
const request = require(`supertest`);
const {app} = require(`../src/server`);
const generatePost = require(`../src/entity-generator`).execute;

const testPost = generatePost();

describe(`POST /api/posts`, () => {
  it(`sends post as json`, async () => {
    const response = await request(app)
      .post(`/api/posts`)
      .send(testPost)
      .set(`Accept`, `application/json`)
      .set(`Content-Type`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    assert.deepEqual(testPost, response.body);
  });

  it(`sends post as form-data`, async () => {
    const response = await request(app)
      .post(`/api/posts`)
      .field(`description`, testPost.description)
      .attach(`image`, `test/fixtures/car.jpeg`)
      .set(`Accept`, `application/json`)
      .set(`Content-Type`, `multipart/form-data`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    assert.deepEqual(testPost.description, response.body.description);
  });
});

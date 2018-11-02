const Cursor = require(`./cursor-mock`);
const generateEntity = require(`../../src/entity-generator`);
const POST_NUMBER = 100;

class PostsStoreMock {
  constructor(data) {
    this.data = data;
  }

  async getPost(date) {
    return this.data.filter((it) => it.date === date)[0];
  }

  async getPosts() {
    return new Cursor(this.data);
  }

  async savePost() {
    return {
      insertedId: 42
    };
  }
}

const posts = Array.from({length: POST_NUMBER}).map(() =>
  generateEntity.execute()
);

module.exports = {
  postsStoreMock: new PostsStoreMock(posts),
  posts
};

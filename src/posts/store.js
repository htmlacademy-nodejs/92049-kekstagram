const db = require(`../database/db`);
const logger = require(`../logger`);

const setupCollection = async () => {
  const dBase = await db;

  const collection = await dBase.createCollection(`posts`);
  collection.createIndex({date: -1}, {unique: true});
  return collection;
};

class PostsStore {
  constructor(collection) {
    this.collection = collection;
  }

  async getPost(date) {
    return (await this.collection).findOne({date});
  }

  async getPosts() {
    return (await this.collection).find();
  }

  async savePost(postData) {
    return (await this.collection).insertOne(postData);
  }
}

module.exports = new PostsStore(
    setupCollection().catch((error) =>
      logger.error(`File to set up posts collection`, error)
    )
);

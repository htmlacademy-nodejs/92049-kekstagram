const logger = require(`../logger`);
const {MongoClient} = require(`mongodb`);

const {DB_HOST = `mongodb://localhost`, DB_PORT = 27017} = process.env;
const url = `${DB_HOST}:${DB_PORT}`;

module.exports = MongoClient.connect(
    url,
    {useNewUrlParser: true}
)
  .then((client) => client.db(`kekstagram`))
  .catch((error) => {
    logger.error(`Filed to connect to MongoDB `, error);
    process.exit(1);
  });

const {MongoClient} = require(`mongodb`);

const url = `mongodb://localhost:27017`;

module.exports = MongoClient.connect(url, {useNewUrlParser: true})
  .then((client) => client.db(`kekstagram`))
  .catch((error) => {
    console.error(`Filed to connect to MongoDB `, error);
    process.exit(1);
  });

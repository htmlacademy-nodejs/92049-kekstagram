const express = require(`express`);

const app = express();

app.use(express.static(`${__dirname}/../static`));
const DEFAULT_PORT = 3000;
const HOST = `127.0.0.1`;

module.exports = {
  name: `server`,
  description: `Run server on 3000 port by default`,
  execute: (command, port = DEFAULT_PORT) => {
    app.listen(port, HOST, () => console.log(`Server running at http://${HOST}:${port}`));
  }
};

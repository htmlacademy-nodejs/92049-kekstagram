const http = require(`http`);
const url = require(`url`);
const fs = require(`fs`);
const path = require(`path`);
const {promisify} = require(`util`);
const readfile = promisify(fs.readFile);
const Mime = {
  ".css": `text/css`,
  ".html": `text/html; charset=UTF-8`,
  ".jpg": `image/jpeg`,
  ".png": `image/png`,
  ".ico": `image/x-icon`
};

const DEFAULT_PORT = 3000;
const HOST = `127.0.0.1`;

const handler = (req, res) => {
  let {pathname: localPath} = url.parse(req.url);

  if (localPath === `/`) {
    localPath = `/index.html`;
  }

  const absolutePath = `${__dirname}/../static${localPath}`;
  const mimeType = Mime[path.extname(absolutePath)];

  (async () => {
    try {
      const data = await readfile(absolutePath);

      res.statusCode = 200;
      res.statusMessage = `OK`;
      res.setHeader = res.setHeader(`Content-Type`, mimeType);
      res.end(data);
    } catch (error) {
      console.error(error);
      res.writeHead(404, `Not Found`);
      res.end();
    }
  })().catch((error) => {
    console.error(error);
    res.writeHead(500, error.message, {
      "Content-Type": `text/plain`
    });
    res.end(error.message);
  });
};

const server = http.createServer(handler);

module.exports = {
  name: `server`,
  description: `Run server on 3000 port by default`,
  execute: (command, port = DEFAULT_PORT) => {
    server.listen(port, HOST, (error) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log(`Server running at http://${HOST}:${port}`);
    });
  }
};

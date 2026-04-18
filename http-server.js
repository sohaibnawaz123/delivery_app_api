const { createServer } = require("http");

const createHttpServer = (app) => {
  return createServer(app);
};

module.exports = createHttpServer;

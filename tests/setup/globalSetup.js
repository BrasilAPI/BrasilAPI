const createServer = require('../helpers/server.js');
const server = createServer();

module.exports = async () => {
  await server.start();
  global.__SERVER__ = server;
};

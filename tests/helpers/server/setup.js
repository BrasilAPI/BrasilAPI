const createServer = require('./index.js');

module.exports = async () => {
  console.log('\n[Start] Global setup');
  global.LOCAL_SERVER = createServer();
  await global.LOCAL_SERVER.start();
  console.log('[Done] Global setup');
};

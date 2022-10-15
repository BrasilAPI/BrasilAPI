const waitOn = require('wait-on');
const childProcess = require('child_process');

function createServer() {
  let localServerProcess;

  function startLocalServer() {
    return childProcess.exec('npm run dev');
  }

  function start() {
    const statusUrl = 'http://localhost:3000/api/status/v1';

    localServerProcess = startLocalServer();

    return waitOn({
      resources: [statusUrl],
    });
  }

  function stop() {
    if (localServerProcess) {
      localServerProcess.kill('SIGINT');
    }
  }

  return {
    start,
    stop,
  };
}

module.exports = createServer;

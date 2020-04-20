const waitOn = require('wait-on');
const childProcess = require('child_process');

const environment = process.env.NODE_ENV || 'test';

function createServer() {
  let localServerProcess;

  function getUrl() {
    if (process.env.NODE_ENV === 'ci') {
      return process.env.PREVIEW_URL;
    }

    return 'http://localhost:3000';
  }

  function startLocalServer() {
    return childProcess.exec('npm run dev');
  }

  function start() {
    const statusUrl = `${getUrl()}/api/status/v1`;

    if (environment === 'test') {
      localServerProcess = startLocalServer();
    }

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
    getUrl,
  };
}

module.exports = createServer;

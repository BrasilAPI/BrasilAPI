import waitOn from 'wait-on';
import child_process from 'child_process';

const environment = process.env.NODE_ENV || 'test';

function createServer() {
  let localServerProcess: child_process.ChildProcess;

  function start() {
    const statusUrl = `${getUrl()}/api/status/v1`;

    if (environment === 'test') {
      localServerProcess = startLocalServer();
    }

    return waitOn({
      resources: [statusUrl],
    });
  }

  function startLocalServer(): child_process.ChildProcess {
    return child_process.exec('npm run dev');
  }

  function stop() {
    if (localServerProcess) {
      localServerProcess.kill('SIGINT');
    }
  }

  function getUrl() {
    if ((process.env.NODE_ENV as any) === 'ci') {
      return process.env.PREVIEW_URL;
    }

    return 'http://localhost:3000';
  }

  return {
    start,
    stop,
    getUrl,
  };
}

export default createServer;

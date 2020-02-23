const waitOn = require('wait-on');
const child_process = require('child_process');
const environment = process.env.NODE_ENV || 'test';

function createServer() {
    let localServerProcess;

    function start() {
        const statusUrl = `${getUrl()}/api/status/v1`;

        if (environment === 'test') {
            localServerProcess = startLocalServer();
        }
        
        return waitOn({
            resources: [statusUrl]
        });
    }

    function startLocalServer() {
        return child_process.exec('npm run dev');
    }

    function stop() {
        if(localServerProcess) {
            localServerProcess.kill('SIGINT');
        }
    }

    function getUrl() {
        if (process.env.NODE_ENV === 'ci') {
            return process.env.PREVIEW_URL;
        }
        
        return 'http://localhost:3000';
    }

    return {
        start,
        stop,
        getUrl
    }
}

module.exports = createServer;
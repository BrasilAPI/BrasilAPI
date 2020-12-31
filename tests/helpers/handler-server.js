import { createServer } from 'vercel-node-server';

export default function createHandlerServer() {
  let server;
  let serverUrl;

  function getUrl() {
    return serverUrl;
  }

  async function start(handler) {
    server = createServer(handler);

    serverUrl = await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.listen(() => {
        const { port } = server.address();
        resolve(`http://localhost:${port}`);
      });
    });
  }

  async function stop() {
    server.close();
  }

  return {
    start,
    stop,
    getUrl,
  };
}

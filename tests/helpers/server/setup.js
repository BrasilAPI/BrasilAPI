import { beforeAll } from 'vitest';
import retry from 'async-retry';

beforeAll(async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error({
      message: 'This script should only be run in test environment',
    });
  }

  const host = 'http://localhost:3000';

  global.SERVER_URL = host;

  async function waitForAllServices() {
    async function waitForWebServer() {
      return retry(
        async (bail, tries) => {
          if (tries >= 25) {
            /* eslint-disable no-console */
            console.log(
              `> Trying to connect to Webserver #${tries}. Are you running the server with "npm run dev"?`
            );
          }
          await fetch(`${host}/api/status/v1`);
        },
        {
          retries: 50,
          minTimeout: 10,
          maxTimeout: 1000,
          factor: 1.1,
        }
      );
    }

    await waitForWebServer();
  }

  await waitForAllServices();
});

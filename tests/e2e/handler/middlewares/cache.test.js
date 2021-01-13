import axios from 'axios';

import createHandlerServer from 'tests/helpers/handler-server';
import { use } from 'handler';

import { cache } from 'handler/middlewares/cache';

describe('handler -> middlewares :: cache', () => {
  const handlerServer = createHandlerServer();
  const startHandlerServer = (...handlers) =>
    handlerServer.start(use([...handlers]));

  // eslint-disable-next-line no-unused-vars
  const successHandler = async (request) => ({
    status: 200,
    body: 'Ok',
    json: false,
  });

  const requestServerHandler = () =>
    axios.get(handlerServer.getUrl(), { validateStatus: () => true });

  afterEach(handlerServer.stop);

  test("should respond with header 'cache-control' with passed time", async () => {
    await startHandlerServer(cache(1000), successHandler);
    const response = await requestServerHandler();

    expect(response.headers).toEqual(
      expect.objectContaining({
        'cache-control':
          'max-age=0, s-maxage=1000, stale-while-revalidate, public',
      })
    );
  });

  test("should respond with header 'cache-control' with default time", async () => {
    await startHandlerServer(cache(), successHandler);
    const response = await requestServerHandler();

    expect(response.headers).toEqual(
      expect.objectContaining({
        'cache-control':
          'max-age=0, s-maxage=86400, stale-while-revalidate, public',
      })
    );
  });
});

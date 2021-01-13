import axios from 'axios';

import createHandlerServer from 'tests/helpers/handler-server';
import { use } from 'handler';

describe('handler :: use', () => {
  const handlerServer = createHandlerServer();

  // eslint-disable-next-line no-unused-vars
  const successHandler = jest.fn(async (request) => ({
    status: 200,
    body: 'Ok',
    json: false,
  }));

  // eslint-disable-next-line no-unused-vars
  const failHandler = jest.fn(async (request) => {
    throw new Error('Fail');
  });

  const middlewareOne = jest.fn((_) => _);
  const middlewareTwo = jest.fn((_) => _);

  // eslint-disable-next-line no-unused-vars
  const errorHandler = jest.fn((error, request) => {
    return { status: 500, body: error.message, json: false };
  });

  const startHandlerServer = (...handlers) =>
    handlerServer.start(
      use([middlewareOne, middlewareTwo, ...handlers], errorHandler)
    );

  const requestServerHandler = () =>
    axios.get(handlerServer.getUrl(), { validateStatus: () => true });

  afterEach(handlerServer.stop);

  afterEach(() => {
    successHandler.mockClear();
    failHandler.mockClear();
    middlewareOne.mockClear();
    middlewareTwo.mockClear();
    errorHandler.mockClear();
  });

  describe('with success handler', () => {
    test("should execute all middlewares and respond with status 200 'Ok'", async () => {
      await startHandlerServer(successHandler);
      const response = await requestServerHandler();

      expect(successHandler).toBeCalledTimes(1);
      expect(middlewareOne).toBeCalledTimes(1);
      expect(middlewareTwo).toBeCalledTimes(1);
      expect(errorHandler).toBeCalledTimes(0);

      expect(response.status).toBe(200);
      expect(response.data).toBe('Ok');
    });
  });

  describe('with fail handler', () => {
    test('should execute all middlewares, error handler and respond with status 500 and error message', async () => {
      await startHandlerServer(failHandler);
      const response = await requestServerHandler();

      expect(failHandler).toBeCalledTimes(1);
      expect(middlewareOne).toBeCalledTimes(1);
      expect(middlewareTwo).toBeCalledTimes(1);
      expect(errorHandler).toBeCalledTimes(1);

      expect(response.status).toBe(500);
      expect(response.data).toBe('Fail');
    });
  });

  test('should execute all handlers with request object as parameter', async () => {
    await startHandlerServer(successHandler);
    await requestServerHandler();

    const expectToBeCalledWithRequestObject = (handler) => {
      const requestParameter = handler.mock.calls[0][0];

      expect(requestParameter).toHaveProperty('method');
      expect(requestParameter).toHaveProperty('url');
      expect(requestParameter).toHaveProperty('headers');
      expect(requestParameter).toHaveProperty('query');
      expect(requestParameter).toHaveProperty('body');
      expect(requestParameter).toHaveProperty('remoteAddress');
      expect(requestParameter).toHaveProperty('cookies');
    };

    expect(successHandler).toBeCalledTimes(1);
    expect(middlewareOne).toBeCalledTimes(1);
    expect(middlewareTwo).toBeCalledTimes(1);

    expectToBeCalledWithRequestObject(successHandler);
    expectToBeCalledWithRequestObject(middlewareOne);
    expectToBeCalledWithRequestObject(middlewareTwo);
  });

  test('should execute error handler with error and request object as parameter', async () => {
    await startHandlerServer(failHandler);
    await requestServerHandler();

    expect(failHandler).toBeCalledTimes(1);
    expect(errorHandler).toBeCalledTimes(1);

    const errorParameter = errorHandler.mock.calls[0][0];
    const requestParameter = errorHandler.mock.calls[0][1];

    expect(errorParameter).toBeInstanceOf(Error);
    expect(requestParameter).toHaveProperty('method');
    expect(requestParameter).toHaveProperty('url');
    expect(requestParameter).toHaveProperty('headers');
    expect(requestParameter).toHaveProperty('query');
    expect(requestParameter).toHaveProperty('body');
    expect(requestParameter).toHaveProperty('remoteAddress');
    expect(requestParameter).toHaveProperty('cookies');
  });
});

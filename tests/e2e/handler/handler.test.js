import axios from 'axios';

import createHandlerServer from '../../helpers/handler-server';
import { use } from '../../../handler';

describe('handler :: use', () => {
  const handlerServer = createHandlerServer();

  // eslint-disable-next-line no-unused-vars
  const successHandler = jest.fn(async (request, response, next) =>
    response.status(200).send('Ok')
  );

  // eslint-disable-next-line no-unused-vars
  const unexpectedFailHandler = jest.fn(async (request, response, next) => {
    throw new Error('Unexpected Error');
  });

  const expectedFailHandler = jest.fn(async (request, response, next) =>
    next(new Error('Expected Error'))
  );

  const middlewareOne = jest.fn((request, response, next) => next());
  const middlewareTwo = jest.fn((request, response, next) => next());
  // eslint-disable-next-line no-unused-vars
  const errorHandler = jest.fn((error, request, response, next) =>
    error.message === 'Expected Error'
      ? response.status(400).send('Bad Request')
      : response.status(500).send('Internal Server Error')
  );

  const startHandlerServer = (...handlers) =>
    handlerServer.start(
      use([middlewareOne, middlewareTwo, ...handlers], errorHandler)
    );

  const requestServerHandler = () =>
    axios.get(handlerServer.getUrl(), { validateStatus: () => true });

  afterEach(handlerServer.stop);

  afterEach(() => {
    successHandler.mockClear();
    unexpectedFailHandler.mockClear();
    expectedFailHandler.mockClear();
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

  describe('with expected fail handler', () => {
    test("should execute all middlewares, error handler and respond with status 400 'Bad Request'", async () => {
      await startHandlerServer(expectedFailHandler);
      const response = await requestServerHandler();

      expect(expectedFailHandler).toBeCalledTimes(1);
      expect(middlewareOne).toBeCalledTimes(1);
      expect(middlewareTwo).toBeCalledTimes(1);
      expect(errorHandler).toBeCalledTimes(1);

      expect(response.status).toBe(400);
      expect(response.data).toBe('Bad Request');
    });
  });

  describe('with unexpected fail handler', () => {
    test("should execute all middlewares, error handler and respond with status 500 'Internal Server Error'", async () => {
      await startHandlerServer(unexpectedFailHandler);
      const response = await requestServerHandler();

      expect(unexpectedFailHandler).toBeCalledTimes(1);
      expect(middlewareOne).toBeCalledTimes(1);
      expect(middlewareTwo).toBeCalledTimes(1);
      expect(errorHandler).toBeCalledTimes(1);

      expect(response.status).toBe(500);
      expect(response.data).toBe('Internal Server Error');
    });
  });
});

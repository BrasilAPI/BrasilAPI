import axios from 'axios';

import createHandlerServer from '../../../helpers/handler-server';
import { use } from '../../../../handler';
import errorHandler from '../../../../handler/middlewares/globals/error-handler';

describe('handler -> middlewares :: error handler', () => {
  const handlerServer = createHandlerServer();
  const mockErrorHandler = jest.fn((error, request, response, next) => {
    response.status(response.statusCode); // fix test when status code pass to error handler by next()
    return errorHandler(error, request, response, next);
  });

  class ExpectedError extends Error {
    constructor({ message, type, errors }) {
      super(message);

      this.name = 'ExpectedError';
      this.message = message;
      this.type = type;
      this.errors = errors;
    }
  }

  // eslint-disable-next-line no-unused-vars
  const expectedFailHandler = jest.fn(async (request, response, next) => {
    response.statusCode = 400;
    return next(
      new ExpectedError({
        message: 'Expected Error',
        type: 'expected_error',
        errors: [
          {
            message: 'Expected Error Detail',
            type: 'expected_error_detail',
          },
        ],
      })
    );
  });

  // eslint-disable-next-line no-unused-vars
  const unexpectedFailHandler = jest.fn(async (request, response, next) => {
    throw new Error('Unexpected Error');
  });

  const startHandlerServer = (...handlers) =>
    handlerServer.start(use([...handlers], mockErrorHandler));

  const requestServerHandler = () =>
    axios.get(handlerServer.getUrl(), { validateStatus: () => true });

  afterEach(() => {
    mockErrorHandler.mockClear();
  });

  afterEach(handlerServer.stop);

  describe('with expected fail handler', () => {
    test('should respond with handler status (400) and handler error data', async () => {
      await startHandlerServer(expectedFailHandler);
      const response = await requestServerHandler();

      expect(expectedFailHandler).toBeCalledTimes(1);
      expect(mockErrorHandler).toBeCalledTimes(1);

      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        name: 'ExpectedError',
        message: 'Expected Error',
        type: 'expected_error',
        errors: [
          {
            message: 'Expected Error Detail',
            type: 'expected_error_detail',
          },
        ],
      });
    });
  });

  describe('with unexpected fail handler', () => {
    test('should respond with status 500 and unexpected error data', async () => {
      await startHandlerServer(unexpectedFailHandler);
      const response = await requestServerHandler();

      expect(unexpectedFailHandler).toBeCalledTimes(1);
      expect(mockErrorHandler).toBeCalledTimes(1);

      expect(response.status).toBe(500);
      expect(response.data).toEqual({
        name: 'Error',
        message: 'Unexpected Error',
      });
    });
  });
});

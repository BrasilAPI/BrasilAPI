import axios from 'axios';

import createHandlerServer from 'tests/helpers/handler-server';
import { use } from 'handler';

import errorHandler from 'handler/middlewares/globals/error-handler';
import ApiError from 'errors/api-error';

describe('handler -> middlewares :: error handler', () => {
  const handlerServer = createHandlerServer();
  const mockErrorHandler = jest.fn(errorHandler);
  const startHandlerServer = (...handlers) =>
    handlerServer.start(use([...handlers], mockErrorHandler));

  // eslint-disable-next-line no-unused-vars
  const expectedFailHandler = jest.fn(async (request) => {
    throw new ApiError({
      status: 400,
      message: 'Bad Request',
      type: 'bad_request',
      data: {
        errors: [
          {
            message: 'Bad Request Detail',
            type: 'bad_request_detail',
          },
        ],
      },
    });
  });

  // eslint-disable-next-line no-unused-vars
  const unexpectedFailHandler = jest.fn(async (request) => {
    throw new Error('Internal Server Error');
  });

  const requestServerHandler = () =>
    axios.get(handlerServer.getUrl(), { validateStatus: () => true });

  afterEach(() => {
    mockErrorHandler.mockClear();
    expectedFailHandler.mockClear();
    unexpectedFailHandler.mockClear();
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
        message: 'Bad Request',
        type: 'bad_request',
        errors: [
          {
            message: 'Bad Request Detail',
            type: 'bad_request_detail',
          },
        ],
      });
    });
  });

  describe('with unexpected fail handler', () => {
    test('should respond with status 500 and no content', async () => {
      await startHandlerServer(unexpectedFailHandler);
      const response = await requestServerHandler();

      expect(unexpectedFailHandler).toBeCalledTimes(1);
      expect(mockErrorHandler).toBeCalledTimes(1);

      expect(response.status).toBe(500);
      expect(response.data).toEqual('');
    });
  });
});

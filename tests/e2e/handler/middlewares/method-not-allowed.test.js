import axios from 'axios';

import createHandlerServer from '../../../helpers/handler-server';
import { use } from '../../../../handler';
import methodNotAllowed from '../../../../handler/middlewares/globals/method-not-allowed';

describe('handler -> middlewares :: method not allowed', () => {
  const handlerServer = createHandlerServer();
  const mockMethodNotAllowed = jest.fn(methodNotAllowed);
  const ignoredHandler = jest.fn((request, response, next) => next());

  const startHandlerServer = (...handlers) =>
    handlerServer.start(use([...handlers, mockMethodNotAllowed]));

  const requestServerHandler = () =>
    axios.get(handlerServer.getUrl(), { validateStatus: () => true });

  afterEach(() => {
    mockMethodNotAllowed.mockClear();
    ignoredHandler.mockClear();
  });

  afterEach(handlerServer.stop);

  describe('without handlers', () => {
    test("should respond with status 405 'Method Not Allowed'", async () => {
      await startHandlerServer();
      const response = await requestServerHandler();

      expect(mockMethodNotAllowed).toBeCalledTimes(1);

      expect(response.status).toBe(405);
      expect(response.data).toBe('Method Not Allowed');
    });
  });

  describe('with ignored handler', () => {
    test("should respond with status 405 'Method Not Allowed'", async () => {
      await startHandlerServer(ignoredHandler);
      const response = await requestServerHandler();

      expect(mockMethodNotAllowed).toBeCalledTimes(1);

      expect(response.status).toBe(405);
      expect(response.data).toBe('Method Not Allowed');
    });
  });
});

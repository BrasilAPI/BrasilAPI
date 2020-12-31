import axios from 'axios';

import createHandlerServer from '../../../helpers/handler-server';
import { use } from '../../../../handler';
import { del, get, patch, post, put } from '../../../../handler/middlewares';

describe('handler -> middlewares :: methods', () => {
  const handlerServer = createHandlerServer();

  // eslint-disable-next-line no-unused-vars
  const getHandler = jest.fn(async (request, response, next) =>
    response.status(200).send('Ok')
  );

  // eslint-disable-next-line no-unused-vars
  const postHandler = jest.fn(async (request, response, next) =>
    response.status(201).send('Created')
  );

  // eslint-disable-next-line no-unused-vars
  const putHandler = jest.fn(async (request, response, next) =>
    response.status(200).send('Updated')
  );

  // eslint-disable-next-line no-unused-vars
  const patchHandler = jest.fn(async (request, response, next) =>
    response.status(200).send('Patched')
  );

  // eslint-disable-next-line no-unused-vars
  const deleteHandler = jest.fn(async (request, response, next) =>
    response.status(200).send('Deleted')
  );

  const startHandlerServer = (...handlers) =>
    handlerServer.start(use([...handlers]));

  afterEach(() => {
    getHandler.mockClear();
    postHandler.mockClear();
    putHandler.mockClear();
    patchHandler.mockClear();
    deleteHandler.mockClear();
  });

  describe('with get method middleware', () => {
    beforeAll(async () => {
      await startHandlerServer(get(getHandler));
    });

    afterAll(handlerServer.stop);

    test("should respond GET method with status 200 'Ok'", async () => {
      const response = await axios.get(handlerServer.getUrl());

      expect(getHandler).toBeCalledTimes(1);

      expect(response.status).toBe(200);
      expect(response.data).toBe('Ok');
    });
  });

  describe('with post method middleware', () => {
    beforeAll(async () => {
      await startHandlerServer(post(postHandler));
    });

    afterAll(handlerServer.stop);

    test("should respond POST method with status 201 'Created'", async () => {
      const response = await axios.post(handlerServer.getUrl(), {});

      expect(postHandler).toBeCalledTimes(1);

      expect(response.status).toBe(201);
      expect(response.data).toBe('Created');
    });
  });

  describe('with put method middleware', () => {
    beforeAll(async () => {
      await startHandlerServer(put(putHandler));
    });

    afterAll(handlerServer.stop);

    test("should respond PUT method with status 200 'Updated'", async () => {
      const response = await axios.put(handlerServer.getUrl(), {});

      expect(putHandler).toBeCalledTimes(1);

      expect(response.status).toBe(200);
      expect(response.data).toBe('Updated');
    });
  });

  describe('with patch method middleware', () => {
    beforeAll(async () => {
      await startHandlerServer(patch(patchHandler));
    });

    afterAll(handlerServer.stop);

    test("should respond PATCH method with status 200 'Patched'", async () => {
      const response = await axios.patch(handlerServer.getUrl(), {});

      expect(patchHandler).toBeCalledTimes(1);

      expect(response.status).toBe(200);
      expect(response.data).toBe('Patched');
    });
  });

  describe('with delete method middleware', () => {
    beforeAll(async () => {
      await startHandlerServer(del(deleteHandler));
    });

    afterAll(handlerServer.stop);

    test("should respond DELETE method with status 200 'Deleted'", async () => {
      const response = await axios.delete(handlerServer.getUrl());

      expect(deleteHandler).toBeCalledTimes(1);

      expect(response.status).toBe(200);
      expect(response.data).toBe('Deleted');
    });
  });

  describe('with multiple method (get and post) middlewares', () => {
    beforeAll(async () => {
      await startHandlerServer(get(getHandler), post(postHandler));
    });

    afterAll(handlerServer.stop);

    test("should respond GET method with status 200 'Ok'", async () => {
      const response = await axios.get(handlerServer.getUrl());

      expect(getHandler).toBeCalledTimes(1);
      expect(postHandler).toBeCalledTimes(0);

      expect(response.status).toBe(200);
      expect(response.data).toBe('Ok');
    });

    test("should respond POST method with status 201 'Created'", async () => {
      const response = await axios.post(handlerServer.getUrl(), {});

      expect(postHandler).toBeCalledTimes(1);
      expect(getHandler).toBeCalledTimes(0);

      expect(response.status).toBe(201);
      expect(response.data).toBe('Created');
    });
  });
});

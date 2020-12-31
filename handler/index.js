import connect from 'connect';
import cors from 'cors';

import globalErrorHandler from './middlewares/globals/error-handler';
import requestLoggerMiddleware from './middlewares/globals/request-logger';
import methodNotAllowed from './middlewares/globals/method-not-allowed';

// eslint-disable-next-line no-unused-vars
const defaultErrorHandler = (error, request, response, next) =>
  response.status(500).send('Internal Server Error');

export function use(handlers, errorHandler = defaultErrorHandler) {
  const app = connect();

  handlers.forEach((handlerFn) =>
    app.use(async (request, response, next) => {
      try {
        return await handlerFn(request, response, next);
      } catch (error) {
        return next(error);
      }
    })
  );

  app.use(errorHandler);
  return app;
}

// Forçamos o retorno para Promise, pois é o esperado da função à Vercel
// Previne log de warning pela Vercel
export function useAsync(handlers, errorHandler) {
  return (request, response) =>
    new Promise((resolve) =>
      use(handlers, errorHandler).handle(request, response, resolve)
    );
}

export function handle(...handlers) {
  return useAsync(
    [requestLoggerMiddleware, cors(), ...handlers, methodNotAllowed],
    globalErrorHandler
  );
}

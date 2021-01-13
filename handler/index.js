import cors from './middlewares/cors';
import globalErrorHandler from './middlewares/globals/error-handler';
import requestLoggerMiddleware from './middlewares/globals/request-logger';

const setResponseHeaders = (headers = [], response) =>
  Object.keys(headers).forEach((name) => {
    const value = headers[name];
    response.setHeader(name, value);
  });

const setResponseStatus = (status = 200, response) => response.status(status);

const sendResponseBody = (body, json = true, response) =>
  json ? response.json(body) : response.send(body);

const sanitizeRequest = (request) => ({
  method: request.method,
  url: request.url,
  headers: request.headers,
  query: request.query,
  body: request.body,
  remoteAddress: request.connection && request.connection.remoteAddress,
  cookies: request.cookies,
});

const processHandlerResult = (result = {}, response) => {
  const { status, headers, body, json } = result;

  setResponseHeaders(headers, response);
  setResponseStatus(status, response);

  if (body) {
    sendResponseBody(body, json, response);
  } else if (status) {
    response.send('');
  }
};

// eslint-disable-next-line no-unused-vars
const defaultErrorHandler = (error, request) => ({
  status: 500,
  body: 'Internal Server Error',
  json: false,
});

export function use(handlers, errorHandler = defaultErrorHandler) {
  // eslint-disable-next-line consistent-return
  return async function resolver(request, response) {
    const sanitizedRequest = sanitizeRequest(request);

    // eslint-disable-next-line no-restricted-syntax
    for await (const handler of handlers) {
      try {
        const result = await handler(sanitizedRequest);
        processHandlerResult(result, response);
      } catch (error) {
        const errorResult = errorHandler(error, sanitizedRequest);
        return processHandlerResult(errorResult, response);
      }
    }
  };
}

export default function handle(...handlers) {
  return use(
    [cors(), requestLoggerMiddleware, ...handlers],
    globalErrorHandler
  );
}

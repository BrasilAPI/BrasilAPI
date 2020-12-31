export default function requestLoggerMiddleware(request, response, next) {
  const clientIp =
    request.headers['x-forwarded-for'] ||
    (request.connection && request.connection.remoteAddress);

  console.log({
    url: request.url,
    clientIp,
  });

  return next();
}

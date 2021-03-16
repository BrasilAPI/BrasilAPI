export default function logger(request, response, next) {
  const clientIp =
    request.headers['x-forwarded-for'] || request.connection.remoteAddress;

  console.log({
    url: request.url,
    clientIp,
  });

  return next();
}

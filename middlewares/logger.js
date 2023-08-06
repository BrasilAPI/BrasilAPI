export default function logger(request, response, next) {
  const clientIp =
    request.headers['x-forwarded-for'] || request.connection.remoteAddress;

  const userAgent = request.headers['user-agent'];

  console.log({
    message: 'Custom request logger',
    url: request.url,
    clientIp,
    userAgent,
  });

  return next();
}

export default function requestLoggerMiddleware(request) {
  const clientIp = request.headers['x-forwarded-for'] || request.remoteAddress;

  console.log({
    url: request.url,
    clientIp,
  });
}

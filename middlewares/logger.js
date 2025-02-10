import { extractIPFromRequest } from '@/lib/parseRequest';

export default function logger(request, response, next) {
  const clientIp = extractIPFromRequest(request);

  const userAgent = request.headers['user-agent'];

  const { origin, referer } = request.headers;

  const logMessage = JSON.stringify({
    url: request.url,
    clientIp,
    userAgent,
    origin,
    referer,
  });

  console.log(logMessage);

  return next();
}

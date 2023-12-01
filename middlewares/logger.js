import { extractIPFromRequest } from '@/lib/parseRequest';

export default function logger(request, response, next) {
  const clientIp = extractIPFromRequest(request);

  const userAgent = request.headers['user-agent'];

  const { origin, referer } = request.headers;

  console.log({
    url: request.url,
    clientIp,
    userAgent,
    origin,
    referer,
  });

  return next();
}

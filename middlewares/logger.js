import { extractIPFromRequest } from '@/lib/parseRequest';

export default function logger(request, response, next) {
  const clientIp = extractIPFromRequest(request);

  const userAgent = request.headers['user-agent'];

  // eslint-disable-next-line no-console
  console.log({
    url: request.url,
    clientIp,
    userAgent,
  });

  return next();
}

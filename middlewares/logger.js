import { extractFromRequest } from '@/lib/parseRequest';

export default function logger(request, response, next) {
  const clientIp = extractFromRequest(request);

  const userAgent = request.headers['user-agent'];

  console.log({
    url: request.url,
    clientIp,
    userAgent,
  });

  return next();
}

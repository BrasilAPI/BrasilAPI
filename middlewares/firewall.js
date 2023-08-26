import UnauthorizedError from '@/errors/UnauthorizedError';
import { isRequestFromCloudflare } from '@/lib/parseRequest';

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

// https://github.com/filipedeschamps/tabnews.com.br/blob/53482fa8d15c273e9dcda80242eaba4d9f37c9a9/middleware.public.js#L13
export default function firewall(request, response, next) {
  if (isProduction && !isRequestFromCloudflare(request)) {
    throw new UnauthorizedError({
      message:
        'Host não autorizado. Por favor, acesse https://brasilapi.com.br',
    });
  }

  return next();
}

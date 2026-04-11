import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';

async function FeriadosIndex(request, response) {
  throw new BadRequestError({
    message: 'Informe o ano: /api/feriados/v1/{ano}',
    type: 'bad_request',
    name: 'YEAR_REQUIRED',
  });
}

export default app().get(FeriadosIndex);

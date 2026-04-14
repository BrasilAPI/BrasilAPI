import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';

async function FeriadosIndex(request, response) {
  throw new BadRequestError({
    message: 'Por favor informe um ano.',
    type: 'validation_error',
  });
}

export default app().get(FeriadosIndex);

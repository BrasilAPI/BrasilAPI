import app from '@/app';

async function FeriadosIndex(request, response) {
  response.status(400);
  response.json({
    message: 'Por favor informe um ano.',
    type: 'validation_error'
  });
}

export default app().get(FeriadosIndex);

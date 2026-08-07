import BaseError from '@/errors/BaseError';

export default function errorHandler(error, request, response) {
  /* eslint-disable no-console */
  console.log({
    url: request.url,
    ...error,
  });

  if (error instanceof BaseError) {
    const errorResponse = {
      message: error.message,
      type: error.type,
      name: error.name,
    };

    if (error.errors.length !== 0) {
      errorResponse.errors = error.errors;
    }

    return response.status(error.status).json(errorResponse);
  }

  // Nunca serializar o erro cru (pode vazar stack trace, configuração de
  // requisição e detalhes internos em respostas públicas).
  return response.status(500).json({
    message: error.message || 'Erro interno do servidor',
    type: 'internal_error',
    name: error.name || 'InternalServerError',
  });
}

import BaseError from '@/errors/BaseError';

export default function errorHandler(error, request, response) {
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

  return response.status(500).json(error);
}

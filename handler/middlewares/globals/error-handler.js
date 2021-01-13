import ApiError from 'errors/api-error';

// eslint-disable-next-line no-unused-vars
export default function errorHandler(error, request) {
  if (error instanceof ApiError) {
    return {
      status: error.status,
      body: {
        message: error.message,
        type: error.type,
        ...error.data,
      },
    };
  }

  return { status: 500 };
}

const errorToResponse = (error) => {
  return {
    name: error.name,
    message: error.message,
    type: error.type,
    errors: error.errors,
  };
};

// eslint-disable-next-line no-unused-vars
export default function errorHandler(error, request, response, next) {
  if (response.statusCode < 400) {
    response.status(500);
  }

  return response.json(errorToResponse(error));
}

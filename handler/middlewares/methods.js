const create = (method) => (handler) => (request, response, next) => {
  if (request.method !== method) {
    return next();
  }

  return handler(request, response, next);
};

export const get = create('GET');
export const post = create('POST');
export const put = create('PUT');
export const del = create('DELETE');
export const patch = create('PATCH');
export const head = create('HEAD');

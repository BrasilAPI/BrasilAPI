import BaseError from './BaseError';

export default class ServiceUnavailableError extends BaseError {
  constructor({
    status = 503,
    name = 'ServiceUnavailableError',
    message,
    type = 'service_unavailable',
    errors = [],
  }) {
    super({
      status,
      name,
      message,
      type,
      errors,
    });
  }
}

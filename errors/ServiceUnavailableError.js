import BaseError from './BaseError';

export default class ServiceUnavailableError extends BaseError {
  constructor({ message }) {
    super({
      status: 503,
      name: 'ServiceUnavailableError',
      message,
      type: 'service_unavailable',
    });
  }
}

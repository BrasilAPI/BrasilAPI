import BaseError from './BaseError';

export default class UnauthorizedError extends BaseError {
  constructor({
    status = 401,
    name = 'UnauthorizedError',
    message,
    type = 'unauthorized',
    errors = [],
  }) {
    super({ message });

    this.name = name;
    this.status = status;
    this.type = type;
    this.errors = errors;
  }
}

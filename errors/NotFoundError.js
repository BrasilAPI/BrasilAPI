import BaseError from './BaseError';

export default class NotFoundError extends BaseError {
  constructor({
    status = 404,
    name = 'NotFoundError',
    message,
    type = 'not_found',
    errors = [],
  }) {
    super({ message });

    this.name = name;
    this.status = status;
    this.type = type;
    this.errors = errors;
  }
}

import BaseError from './BaseError';

export default class BadRequestError extends BaseError {
  constructor({
    status = 400,
    message,
    name = 'BadRequestError',
    type = 'bad_request',
    errors = [],
  }) {
    super({ message });

    this.name = name;
    this.status = status;
    this.type = type;
    this.errors = errors;
  }
}

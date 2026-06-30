import BaseError from './BaseError';

export default class UnprocessableEntityError extends BaseError {
  constructor({
    status = 422,
    name = 'UnprocessableEntityError',
    message,
    type = 'unprocessable_entity',
    errors = [],
  }) {
    super({ message });

    this.name = name;
    this.status = status;
    this.type = type;
    this.errors = errors;
  }
}

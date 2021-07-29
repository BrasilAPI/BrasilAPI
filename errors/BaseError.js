export default class BaseError extends Error {
  constructor({
    status = 500,
    name = 'BaseError',
    message,
    type = 'base_error',
    errors = [],
  }) {
    super(message);

    this.name = name;
    this.status = status;
    this.type = type;
    this.errors = errors;
  }
}

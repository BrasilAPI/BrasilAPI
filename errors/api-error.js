export default class ApiError extends Error {
  constructor({ status = 500, message, type, data = {} }) {
    super(message);

    this.name = 'ApiError';
    this.status = status;
    this.type = type;
    this.data = data;
  }
}

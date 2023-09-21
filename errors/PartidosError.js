class PartidosError extends Error {

  constructor({ type, message }) {
    super();

    this.name = 'PartidosError';
    this.type = type;
    this.message = message;
  }

}

export default PartidosError
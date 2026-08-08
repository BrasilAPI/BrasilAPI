import cid10repository from './cid10.json';

export function getAll() {
  return cid10repository;
}

export function findByCode(code) {
  return cid10repository.find((cid10) => {
    return cid10.codigo === code;
  });
}

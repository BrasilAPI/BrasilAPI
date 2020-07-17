import { get } from './api';

const urlUf = ' https://servicodados.ibge.gov.br/api/v1/localidades/estados';

export const getUfs = () => get(urlUf);
export const getUfByCode = (code) => get(`${urlUf}/${code}`);

import axios from 'axios';

const urlUf = ' https://servicodados.ibge.gov.br/api/v1/localidades/estados';

export const getUfs = () => axios.get(urlUf);
export const getUfByCode = (code) => axios.get(`${urlUf}/${code}`);

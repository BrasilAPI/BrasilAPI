import axios from 'axios';
import { baseURL, logger } from '../utils';
import ufList from './ufList.json';

const urlUf = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

export const getUfs = async () => {
  try {
    const { data, status } = await axios.get(urlUf);
    return {
      data,
      status,
    };
  } catch (error) {
    return {
      data: ufList,
      status: 200,
    };
  }
};

export const getUfByCode = async (code) => {
  const { data: ufs, headers } = await axios.get(`${baseURL}/api/ibge/uf/v1`);

  logger({
    message: 'Fetched data from list UFs endpoint',
    headers,
    baseURL,
  });

  const uf = ufs.find(({ id, sigla }) => {
    return (
      String(id) === String(code) ||
      sigla.toLowerCase() === String(code).toLowerCase()
    );
  });

  if (!uf) {
    throw new Error('not_found');
  }

  return uf;
};

import axios from 'axios';
import { ELECTIONS_API_URL, ORDINARY_ELECTIONS_URL } from './constants';

export const listOrdinaryElections = async () => {
  try {
    const response = await axios.get(
      `${ELECTIONS_API_URL}${ORDINARY_ELECTIONS_URL}`
    );

    return response.data;
  } catch (error) {
    const err = new Error('Falha ao buscar eleições ordinárias.');
    err.name = 'OrdinaryElectionsPromiseError';
    err.original = error;
    throw err;
  }
};

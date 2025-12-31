import axios from 'axios';
import { ELECTIONS_API_URL, ELECTIONS_YEARS_URL } from './constants';

export const listElectionYears = async () => {
  try {
    const response = await axios.get(
      `${ELECTIONS_API_URL}${ELECTIONS_YEARS_URL}`
    );

    return response.data;
  } catch (error) {
    const err = new Error('Falha ao buscar anos eleitorais.');
    err.name = 'ElectionYearsPromiseError';
    err.original = error;
    throw err;
  }
};

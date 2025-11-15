import axios from 'axios';
import { ELECTIONS_API_URL, ELECTIONS_YEARS_URL } from './constants';

export const listarAnosEleitorais = async () => {
  const response = await axios.get(
    `${ELECTIONS_API_URL}${ELECTIONS_YEARS_URL}`
  );

  return response.data;
};

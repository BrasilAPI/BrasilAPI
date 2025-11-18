import axios from 'axios';
import {
  ELECTIONS_API_URL,
  ERRORMESSAGES,
  POSITION_LIST_URL,
  verifyIsNotNumber,
} from './constants';

export const listPositionsByMunicipality = async (election, municipality) => {
  if (!election || !municipality)
    throw new Error(ERRORMESSAGES.INVALID_PARAMETERS);

  if (typeof municipality !== 'string' && verifyIsNotNumber(municipality))
    throw new Error(ERRORMESSAGES.INVALID_MUNICIPALITY);

  if (typeof election !== 'string' && verifyIsNotNumber(election))
    throw new Error(ERRORMESSAGES.INVALID_ELECTION);

  const requestUrl = `${ELECTIONS_API_URL}${POSITION_LIST_URL}/${election}/${municipality}/cargos`;

  try {
    const response = await axios.get(requestUrl);
    return response.data;
  } catch (error) {
    const err = new Error('Falha ao buscar cargos por município.');
    err.name = 'PositionsByMunicipalityPromiseError';
    err.original = error;
    throw err;
  }
};

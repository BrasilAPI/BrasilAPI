import axios from 'axios';
import BadRequestError from '@/errors/BadRequestError';
import {
  ELECTIONS_API_URL,
  ERRORMESSAGES,
  POSITION_LIST_URL,
  verifyIsNotNumber,
} from './constants';

export const listPositionsByMunicipality = async (election, municipality) => {
  if (!election || !municipality)
    throw new BadRequestError({
      message: ERRORMESSAGES.INVALID_PARAMETERS,
      type: 'invalid_parameters',
    });

  if (typeof municipality !== 'string' && verifyIsNotNumber(municipality))
    throw new BadRequestError({
      message: ERRORMESSAGES.INVALID_MUNICIPALITY,
      type: 'invalid_municipality',
    });

  if (typeof election !== 'string' && verifyIsNotNumber(election))
    throw new BadRequestError({
      message: ERRORMESSAGES.INVALID_ELECTION,
      type: 'invalid_election',
    });

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

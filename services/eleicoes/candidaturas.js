import axios from 'axios';
import BadRequestError from '@/errors/BadRequestError';
import {
  ELECTIONS_API_URL,
  CANDIDATE_LIST_URL,
  CANDIDATE_SEARCH_URL,
  verifyIsNotNumber,
  ERRORMESSAGES,
} from './constants';

export const listCandidatureByMunicipality = async (
  election,
  year,
  municipality,
  position
) => {
  if (!election || !year || !municipality || !position) {
    throw new BadRequestError({
      message: ERRORMESSAGES.INVALID_PARAMETERS,
      type: 'invalid_parameters',
    });
  }

  const yearStr = String(year);
  if (yearStr.length !== 4) {
    throw new BadRequestError({
      message: ERRORMESSAGES.INVALID_YEAR,
      type: 'invalid_year',
    });
  }

  if (typeof municipality !== 'string' && verifyIsNotNumber(municipality)) {
    throw new BadRequestError({
      message: ERRORMESSAGES.INVALID_MUNICIPALITY,
      type: 'invalid_municipality',
    });
  }

  if (typeof position !== 'string' && verifyIsNotNumber(position)) {
    throw new BadRequestError({
      message: ERRORMESSAGES.INVALID_POSITION,
      type: 'invalid_position',
    });
  }

  if (typeof election !== 'string' && verifyIsNotNumber(election)) {
    throw new BadRequestError({
      message: ERRORMESSAGES.INVALID_ELECTION,
      type: 'invalid_election',
    });
  }

  try {
    const requestUrl = `${ELECTIONS_API_URL}${CANDIDATE_LIST_URL}/${year}/${municipality}/${election}/${position}/candidatos`;

    const response = await axios.get(requestUrl);
    return response.data;
  } catch (error) {
    const err = new Error('Erro ao buscar candidaturas.');
    err.name = 'CandidaturesPromiseError';
    err.original = error;
    throw err;
  }
};

export const searchCandidate = async (
  election,
  year,
  municipality,
  candidate
) => {
  if (!election || !year || !municipality || !candidate)
    throw new BadRequestError({
      message: ERRORMESSAGES.INVALID_PARAMETERS,
      type: 'invalid_parameters',
    });

  const yearStr = String(year);
  if (yearStr.length !== 4)
    throw new BadRequestError({
      message: ERRORMESSAGES.INVALID_YEAR,
      type: 'invalid_year',
    });

  if (typeof municipality !== 'string' && verifyIsNotNumber(municipality))
    throw new BadRequestError({
      message: ERRORMESSAGES.INVALID_MUNICIPALITY,
      type: 'invalid_municipality',
    });

  if (typeof candidate !== 'string' && verifyIsNotNumber(candidate))
    throw new BadRequestError({
      message: ERRORMESSAGES.INVALID_CANDIDATE,
      type: 'invalid_candidate',
    });

  try {
    const requestUrl = `${ELECTIONS_API_URL}${CANDIDATE_SEARCH_URL}/${yearStr}/${municipality}/${election}/candidato/${candidate}`;

    const response = await axios.get(requestUrl);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      const notFoundError = new Error('Candidate não encontrado.');
      notFoundError.name = 'CandidateNotFoundError';
      throw notFoundError;
    }
    throw error;
  }
};

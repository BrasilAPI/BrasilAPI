import axios from 'axios';
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
    throw new Error(ERRORMESSAGES.INVALID_PARAMETERS);
  }

  const yearStr = String(year);
  if (yearStr.length !== 4) {
    throw new Error(ERRORMESSAGES.INVALID_YEAR);
  }

  if (typeof municipality !== 'string' && verifyIsNotNumber(municipality)) {
    throw new Error(ERRORMESSAGES.INVALID_MUNICIPALITY);
  }

  if (typeof position !== 'string' && verifyIsNotNumber(position)) {
    throw new Error(ERRORMESSAGES.INVALID_POSITION);
  }

  if (typeof election !== 'string' && verifyIsNotNumber(election)) {
    throw new Error(ERRORMESSAGES.INVALID_ELECTION);
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
    throw new Error(ERRORMESSAGES.INVALID_PARAMETERS);

  const yearStr = String(year);
  if (yearStr.length !== 4) throw new Error(ERRORMESSAGES.INVALID_YEAR);

  if (typeof municipality !== 'string' && verifyIsNotNumber(municipality))
    throw new Error(ERRORMESSAGES.INVALID_MUNICIPALITY);

  if (typeof candidate !== 'string' && verifyIsNotNumber(candidate))
    throw new Error(ERRORMESSAGES.INVALID_CANDIDATE);

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
  }
};

import axios from 'axios';
import {
  ELECTIONS_API_URL,
  CANDIDATE_LIST_URL,
  CANDIDATE_SEARCH_URL,
} from './constants';

export const listarCandidaturasMunicipio = async (
  election,
  year,
  municipality,
  position
) => {
  if (!election || !year || !municipality || !position) {
    throw new Error('Parâmetros obrigatórios inválidos');
  }

  const yearStr = String(year);
  if (yearStr.length !== 4) {
    throw new Error('Ano precisa ter 4 dígitos');
  }

  if (typeof municipality !== 'string' && typeof municipality !== 'number') {
    throw new Error('Código do município inválido');
  }

  if (typeof position !== 'string' && typeof position !== 'number') {
    throw new Error('Cargo inválido');
  }

  if (typeof election !== 'string' && typeof election !== 'number') {
    throw new Error('codigo de eleição inválido');
  }

  const requestUrl = `${ELECTIONS_API_URL}${CANDIDATE_LIST_URL}/${year}/${municipality}/${election}/${position}/candidatos`;

  const response = await axios.get(requestUrl);
  return response.data;
};

export const buscarCandidato = async (eleicao, ano, municipio, candidato) => {
  if (!eleicao || !ano || !municipio || !candidato) {
    throw new Error('Parâmetros obrigatórios inválidos');
  }

  const anoStr = String(ano);
  if (anoStr.length !== 4) {
    throw new Error('Ano precisa ter 4 dígitos');
  }

  if (typeof municipio !== 'string' && typeof municipio !== 'number') {
    throw new Error('Código do município inválido');
  }
  if (typeof candidato !== 'string' && typeof candidato !== 'number') {
    throw new Error('Candidato inválido');
  }

  const requestUrl = `${ELECTIONS_API_URL}${CANDIDATE_SEARCH_URL}/${anoStr}/${municipio}/${eleicao}/candidato/${candidato}`;

  const response = await axios.get(requestUrl);
  return response.data;
};

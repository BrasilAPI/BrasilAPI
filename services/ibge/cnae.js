import axios from 'axios';

const CNAE_URL = 'https://servicodados.ibge.gov.br/api/v2/cnae';

export const getCNAEClasses = () => axios.get(`${CNAE_URL}/classes`);

export const getCNAEClassById = (id) => axios.get(`${CNAE_URL}/classes/${id}`);

export const getCNAEClassesByDivision = (division) =>
  axios.get(`${CNAE_URL}/divisoes/${division}/classes`);

export const getCNAEClassesByGroup = (group) =>
  axios.get(`${CNAE_URL}/grupos/${group}/classes`);

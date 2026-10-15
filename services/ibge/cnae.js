import ibgeHttpClient from '@/services/ibge/httpClient';

const CNAE_URL = 'https://servicodados.ibge.gov.br/api/v2/cnae';

export const getCNAEClasses = () => ibgeHttpClient.get(`${CNAE_URL}/classes`);

export const getCNAEClassById = (id) =>
  ibgeHttpClient.get(`${CNAE_URL}/classes/${id}`);

export const getCNAEClassesByDivision = (division) =>
  ibgeHttpClient.get(`${CNAE_URL}/divisoes/${division}/classes`);

export const getCNAEClassesByGroup = (group) =>
  ibgeHttpClient.get(`${CNAE_URL}/grupos/${group}/classes`);

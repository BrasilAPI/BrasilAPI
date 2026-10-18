import httpClient from '@/lib/http/client';

const CNAE_URL = 'https://servicodados.ibge.gov.br/api/v2/cnae';

export const getCNAEClasses = () => httpClient.get(`${CNAE_URL}/classes`);

export const getCNAEClassById = (id) => httpClient.get(`${CNAE_URL}/classes/${id}`);

export const getCNAEClassesByDivision = (division) =>
  httpClient.get(`${CNAE_URL}/divisoes/${division}/classes`);

export const getCNAEClassesByGroup = (group) =>
  httpClient.get(`${CNAE_URL}/grupos/${group}/classes`);

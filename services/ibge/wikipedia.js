import wiki from 'wikijs';

const CODIGOS_ESTADOS = {
  AC: 'Acre',
  AL: 'Alagoas',
  AP: 'Amapá',
  AM: 'Amazonas',
  BA: 'Bahia',
  CE: 'Ceará',
  DF: 'Distrito Federal',
  ES: 'Espírito Santo',
  GO: 'Goiás',
  MA: 'Maranhão',
  MT: 'Mato Grosso',
  MS: 'Mato Grosso do Sul',
  MG: 'Minas Gerais',
  PA: 'Pará',
  PB: 'Paraíba',
  PR: 'Paraná',
  PE: 'Pernambuco',
  PI: 'Piauí',
  RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul',
  RO: 'Rondônia',
  RR: 'Roraima',
  SC: 'Santa Catarina',
  SP: 'São Paulo',
  SE: 'Sergipe',
  TO: 'Tocantins',
};

export const getStateCities = async (uf) => {
  if (!uf) {
    throw new Error('InsuficientDataException');
  }

  const formattedUF = uf.toUpperCase();
  const state = CODIGOS_ESTADOS[formattedUF];

  if (!state) {
    throw new Error('EstadoNotFoundException');
  }

  const formatName = (name) =>
    name
      .replace(`BR-${formattedUF}-`, '')
      .replace(/\W-/g, '')
      .replace('{{', '')
      .replace('}}', '');

  const formatIbgeCode = (code) =>
    code.replace(/\W/g, '').replace('formatnum', '');

  const pageNames = await wiki({
    apiUrl: 'https://pt.wikipedia.org/w/api.php',
  }).search(`Lista de municípios ${state}`);

  const correctIndex = pageNames.results[0].includes('por população') ? 1 : 0;

  const stateInfo = await wiki({
    apiUrl: 'https://pt.wikipedia.org/w/api.php',
  }).page(pageNames.results[correctIndex]);

  stateInfo.cities = await stateInfo.tables();

  if (!stateInfo.cities || stateInfo.cities.length === 0) {
    return [];
  }

  const cities = stateInfo.cities[0]
    .filter((city) => {
      const keys = Object.keys(city).map((key) => key.toLocaleLowerCase());
      const ibgeCodeIndex = keys.findIndex((key) => key.includes('ibge'));
      return ibgeCodeIndex !== -1 && Object.values(city)[ibgeCodeIndex];
    })
    .map((city) => {
      const keys = Object.keys(city).map((key) => key.toLocaleLowerCase());
      const ibgeCodeIndex = keys.findIndex((key) => key.includes('ibge'));
      const ibgeCode = Object.values(city)[ibgeCodeIndex];
      const name = city['município'] || Object.values(city)[1];

      return { name: formatName(name), codigo_ibge: formatIbgeCode(ibgeCode) };
    });

  return cities;
};

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
  if (uf === '') {
    throw new Error('InsuficientDataException');
  }

  const formattedUF = uf.toUpperCase();

  if (typeof CODIGOS_ESTADOS[formattedUF] === 'undefined') {
    throw new Error('EstadoNotFoundException');
  }

  const state = CODIGOS_ESTADOS[formattedUF];

  const formatName = (name) => {
    return name
      .replace(`BR-${formattedUF}-`, '')
      .replace(/\W-/g, '')
      .replace('{{', '')
      .replace('}}', '');
  };

  const formatIbgeCode = (code) => {
    return code.replace(/\W/g, '').replace('formatnum', '');
  };

  const pageNames = await wiki({
    apiUrl: 'https://pt.wikipedia.org/w/api.php',
  }).search(`Lista de municípios ${state}`);

  let correctIndex = 0;

  if (pageNames.results[0].indexOf('por população') !== -1) {
    correctIndex = 1;
  }

  const stateInfo = await wiki({
    apiUrl: 'https://pt.wikipedia.org/w/api.php',
  }).page(pageNames.results[correctIndex]);

  stateInfo.cities = await stateInfo.tables();

  const cities = [];

  stateInfo.cities[0].forEach((city) => {
    const arrKeys = Object.keys(city);
    if (typeof city[arrKeys[1]] !== 'undefined') {
      cities.push({
        nome: formatName(city[arrKeys[1]]),
        codigo_ibge: formatIbgeCode(city[arrKeys[2]]),
      });
    }
  });
  return cities;
};

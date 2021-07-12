import fetch from 'node-fetch';

const endPoint = 'https://dadosabertos.camara.leg.br/api/v2/partidos?itens=50';

async function getPartidos(data) {

  return Promise.resolve(data)
    .then(validateQueryParams)
    .then(fetchData)
    .catch((error) => {
      throw error;
    });

}

async function fetchData(data) {
  return fetch(`${endPoint}&ordem=${data.ordem || 'ASC'}&ordenarPor=${data.ordenarPor || 'sigla'}`, {
    headers: {
      'Accept': 'application/json'
    }
  }).then(validateResponse).then(parseResponse);
}

function validateQueryParams(data) {

  const { ordem, ordenarPor } = data;

  if (ordem && ['ASC', 'DESC'].indexOf(ordem) === -1)
    throw new Error('A ordem só pode ser ASC (A-Z e/ou 0-9) ou DESC (Z-A e/ou 9-0).');

  if (ordenarPor && ['id', 'sigla', 'nome'].indexOf(ordenarPor) === -1)
    throw new Error('Só é possível ordenar por id, sigla ou nome dos partidos.');

  return data;
}

function validateResponse(response) {
  if (!response.ok || response.status !== 200)
    throw new Error('Algo saiu mal ao tentar pegar os dados. Desculpe.');
  
  return response;
}

async function parseResponse(response) {
  const json = await response.json();

  return json.dados;
}

export default getPartidos;
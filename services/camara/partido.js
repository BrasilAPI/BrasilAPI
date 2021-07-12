import fetch from 'node-fetch';
import PartidosError from '../../errors/PartidosError';

const endPoint = 'https://dadosabertos.camara.leg.br/api/v2/partidos';

const requestOptions = {
  headers: {
    'Accept': 'application/json'
  }
};

async function getPartido(data) {

  return Promise.resolve(data)
    .then(fetchData)
    .catch((error) => {
      throw error;
    });

}

async function fetchData(data) {
  let response = await fetch(`${endPoint}/${data.partido}`, requestOptions)
    .then(validateResponse)
    .then(parseResponse);

  if (data.incluirMembros) {
    const { status: { totalMembros } } = response;
    const membros = await fetch(`${endPoint}/${data.partido}/membros?itens=${totalMembros}`)
      .then(validateResponse)
      .then(parseResponse);

    response = { ...response, membros };
  }

  return response;
}

function validateResponse(response) {
  if(response.status === 404)
      throw new PartidosError({ type: 'not_found', message: 'Este partido não existe.' });

  if (!response.ok || response.status !== 200)
    throw new PartidosError({ type: 'unknown_error', message: 'Algo saiu mal ao tentar pegar os dados. Desculpe.' });

  return response;
}

async function parseResponse(response) {
  const json = await response.json();

  return json.dados;
}

export default getPartido;
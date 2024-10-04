/* eslint-disable no-console */
import axios from 'axios';

const BASE_URL = 'https://dadosabertos.camara.leg.br/api/v2/partidos';
const BASE_URL_BRASILAPI = 'https://brasilapi.com.br/api/partidos/v1';

function transformarURL(url) {
  const baseUrlCâmara = 'https://dadosabertos.camara.leg.br/api/v2/partidos/';

  if (url.startsWith(baseUrlCâmara)) {
    const partidoId = url.replace(baseUrlCâmara, '');
    return `${BASE_URL_BRASILAPI}/${partidoId}`;
  }

  const urlObj = new URL(url);
  if (urlObj.pathname === '/api/v2/partidos') {
    const searchParams = urlObj.search;
    return `${BASE_URL_BRASILAPI}${searchParams}`;
  }

  return url;
}

export const getParties = async (page = 1, itemsPerPage = 15) => {
  const url = `${BASE_URL}?ordem=ASC&ordenarPor=sigla&pagina=${page}&itens=${itemsPerPage}`;

  const { data } = await axios.get(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!data || !data.dados || !Array.isArray(data.dados)) {
    console.error('Estrutura inesperada de dados ou dados ausentes:', data);
    return { partidos: [], links: {} };
  }

  const partidos = data.dados.map((partido) => ({
    ...partido,
    uri: transformarURL(partido.uri),
  }));

  const links = data.links.map((link) => {
    return {
      ...link,
      href: transformarURL(link.href),
    };
  });

  return { partidos, links };
};

export const getParty = async (id) => {
  const { data } = await axios.get(`${BASE_URL}/${id}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!data || !data.dados) {
    console.error('Estrutura inesperada de dados ou dados ausentes:', data);
    return null;
  }

  const { uri, ...partido } = data.dados;

  const partidoData = {
    ...partido,
    uri: transformarURL(uri),
  };

  return partidoData;
};

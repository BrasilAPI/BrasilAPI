/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const URL = 'https://dadosabertos.camara.leg.br/api/v2/partidos';

function transformarURL(url) {
  const baseUrlCâmara = 'https://dadosabertos.camara.leg.br/api/v2/partidos/';
  const baseUrlBrasilAPI = 'https://brasilapi.com.br/api/partidos/';

  if (url.startsWith(baseUrlCâmara)) {
    const partidoId = url.replace(baseUrlCâmara, '');
    return baseUrlBrasilAPI + partidoId;
  } else {
    return 'URL não corresponde ao formato esperado.';
  }
}

export const getParties = async () => {
  try {
    const { data } = await axios.get(URL, {
      headers: {
        Accept: 'application/xml',
      },
    });

    const parser = new XMLParser();
    const jsonData = parser.parse(data);

    if (
      !jsonData ||
      !jsonData.xml ||
      !jsonData.xml.dados ||
      !jsonData.xml.dados.partido_ ||
      !Array.isArray(jsonData.xml.dados.partido_)
    ) {
      console.error(
        'Estrutura inesperada de dados ou dados ausentes:',
        jsonData
      );
      return [];
    }

    const partidos = jsonData.xml.dados.partido_.map((partido) => ({
      id: partido.id,
      sigla: partido.sigla,
      nome: partido.nome,
      uri: transformarURL(partido.uri),
    }));

    return partidos;
  } catch (error) {
    console.error('Erro ao buscar dados da API:', error);
    return [];
  }
};

export const getParty = async (id) => {
  try {
    const { data } = await axios.get(`${URL}/${id}`, {
      headers: {
        Accept: 'application/xml',
      },
    });
    const parser = new XMLParser();
    const jsonData = parser.parse(data);
    if (!jsonData || !jsonData.xml || !jsonData.xml.dados) {
      console.error(
        'Estrutura inesperada de dados ou dados ausentes:',
        jsonData
      );
      return null;
    }

    const { uri, ...partido } = jsonData.xml.dados;

    const partidoData = {
      ...partido,
      uri: transformarURL(uri),
    };

    return partidoData;
  } catch (error) {
    console.error('Erro ao buscar partido da API:', error);
    return null;
  }
};

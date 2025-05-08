import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import normalizeBrazilianDate from '@/util/normalizeBrazilianDate';
import { CONDITION_DESCRIPTIONS, CPTEC_URL } from './constants';

const parser = new XMLParser();

/**
 * Format meteorology metadata
 * @param {object} item
 * @returns {object}
 */
function formatMetar(item) {
  const newItem = item;
  newItem.codigo_icao = item.codigo;
  newItem.pressao_atmosferica = item.pressao;
  newItem.vento = item.vento_int;
  newItem.direcao_vento = item.vento_dir;
  newItem.condicao = item.tempo;
  newItem.condicao_desc = item.tempo_desc;
  newItem.temp = item.temperatura;
  newItem.atualizado_em = normalizeBrazilianDate(item.atualizacao);

  delete newItem.codigo;
  delete newItem.pressao;
  delete newItem.vento_int;
  delete newItem.vento_dir;
  delete newItem.tempo;
  delete newItem.tempo_desc;
  delete newItem.temperatura;
  delete newItem.atualizacao;

  return newItem;
}

/**
 * Format prediction to return
 * @param {object} unformattedData
 * @returns {object}
 */
function formatPrediction(unformattedData) {
  const formattedData = {
    cidade: unformattedData.cidade.nome,
    estado: unformattedData.cidade.uf,
    atualizado_em: unformattedData.cidade.atualizacao,
    clima: unformattedData.cidade.previsao.map((oneDay) => {
      return {
        data: oneDay.dia,
        condicao: oneDay.tempo,
        condicao_desc: CONDITION_DESCRIPTIONS[oneDay.tempo],
        min: oneDay.minima,
        max: oneDay.maxima,
        indice_uv: oneDay.iuv,
      };
    }),
  };
  return formattedData;
}

/**
 * Get current weather data for all Brazilian Capitals
 * @returns {Array}
 */
export const getCurrentCapitalWeatherData = async () => {
  const currentData = await axios.get(
    `${CPTEC_URL}/capitais/condicoesAtuais.xml`,
    {
      responseType: 'application/xml',
      responseEncoding: 'utf-8',
    }
  );

  const parsed = parser.parse(currentData.data);

  if (parsed.capitais.metar) {
    return parsed.capitais.metar.map(formatMetar);
  }
  return [];
};

/**
 * Get current weather data for a Brazilian Airport by ICAO code
 * @param {string} icaoCode
 * @returns {object}
 */
export const getCurrentAirportWeather = async (icaoCode) => {
  const airportWeather = await axios.get(
    `${CPTEC_URL}/estacao/${icaoCode}/condicoesAtuais.xml`,
    {
      responseType: 'application/xml',
      responseEncoding: 'utf-8',
    }
  );
  const parsed = parser.parse(airportWeather.data);

  if (parsed.metar) {
    return formatMetar(parsed.metar);
  }
  return [];
};

/**
 * Get weather predicion for the next {days} with a limit of 14 days
 * @param {int} cityCode
 * @param {int} days
 * @returns {object}
 */
export const getPredictionWeather = async (cityCode, days) => {
  const baseUrl = `${CPTEC_URL}/cidade/`;
  let url = baseUrl;
  if (days <= 4) {
    url += `${cityCode}/previsao.xml`;
  } else {
    url += `7dias/${cityCode}/previsao.xml`;
  }

  const weatherPredictions = await axios.get(url, {
    responseType: 'application/xml',
    responseEncoding: 'binary',
  });

  const parsed = parser.parse(weatherPredictions.data);

  if (parsed.cidade) {
    const jsonData = formatPrediction(parsed);
    if (jsonData.cidade === 'null') {
      return null;
    }

    // If number of days requested was greater than 7, load extended data from service
    // Disabled by inconsistences on CPTEC endpoints
    /* if (days > 7) {
      const extendedPredictions = await axios.get(
        `${baseUrl + cityCode}/estendida.xml`,
        {
          responseType: 'application/xml',
          responseEncoding: 'binary',
        }
      );

      const extendedJsonData = parser.parse(extendedPredictions.data);
      if (extendedJsonData.cidade) {
        jsonData.clima = [
          ...jsonData.clima,
          ...formatPrediction(extendedJsonData).clima,
        ];
      }
    } */

    // IF total data greater than requested number of days, slice array into correct size
    if (jsonData.clima.length > days) {
      jsonData.clima = jsonData.clima.slice(0, days);
    }

    return jsonData;
  }
  return [];
};

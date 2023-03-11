import { igpmSchema } from './schemas';
import { buildUrl, fetchData } from './helpers';
import { toISOString } from '../date';

/**
 * Formata e realiza a conversão do valor IGPM para ponto flutuante
 * @param {String} value Valor do IGPM em formato string
 * @returns Number
 */
const normalizeIgpmValue = (value) => {
  const valueInFloatString = value.replace(',', '.');

  return parseFloat(valueInFloatString);
};

/**
 * Busca todos os indices desde o inicio da disponibilização
 * @param {Number} code Código BCB https://www3.bcb.gov.br/sgspub/localizarseries/localizarSeries.do?method=prepararTelaLocalizarSeries
 * @returns
 */
export const getIgpm = async (code) => {
  const data = await fetchData(buildUrl.simple(code), igpmSchema);

  return data.map((igpmIndex) => ({
    value: normalizeIgpmValue(igpmIndex.valor),
    date: toISOString(igpmIndex.data, 'DD/MM/YYYY'),
  }));
};

/**
 * Busca todos os registro dentro de um periodo
 * @param {Number} code Código BCB https://www3.bcb.gov.br/sgspub/localizarseries/localizarSeries.do?method=prepararTelaLocalizarSeries
 * @param {Date} initialDate Data inicial do intervalo
 * @param {Date} endDate Data final do intervalo
 */
export const getIgpmByPeriod = async (code, initialDate, endDate) => {
  const data = await fetchData(buildUrl.simple(code), igpmSchema, {
    dataInicial: initialDate,
    dataFinal: endDate,
  });

  return data.map((igpmIndex) => ({
    value: normalizeIgpmValue(igpmIndex.valor),
    date: toISOString(igpmIndex.data, 'DD/MM/YYYY'),
  }));
};

/**
 * Busca os ultimos registros de acordo com o número passado.
 * @param {Number} code Código BCB https://www3.bcb.gov.br/sgspub/localizarseries/localizarSeries.do?method=prepararTelaLocalizarSeries
 * @param {Number} numberOfRecords Quantidade de registros a serem obtidos
 */
export const getIgpmByLastNRecords = async (code, numberOfRecords = 12) => {
  const data = await fetchData(
    buildUrl.lastRecords(code, numberOfRecords),
    igpmSchema
  );

  return data.map((igpmIndex) => ({
    value: normalizeIgpmValue(igpmIndex.valor),
    date: toISOString(igpmIndex.data, 'DD/MM/YYYY'),
  }));
};

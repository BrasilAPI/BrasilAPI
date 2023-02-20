import axios from 'axios';
import { formatDate, getNow } from '../date';

const API_URL = `https://www.bcb.gov.br/content/estabilidadefinanceira/spi/participantes-spi-`;

const buildDate = (now = getNow()) => formatDate(now, 'YYYYMMDD');

export const getParticipants = async (fromToday = true) => {
  const date = fromToday ? buildDate() : buildDate(getNow().subtract(1, 'day'));

  const url = `${API_URL}${date}.csv`;
  const csvPix = await axios.get(url);
  return csvPix.data;
};

/**
 * Parse dos dados obtidos do Banco Central
 *
 * @param {string} file CSV - Participantes do PIX
 * @returns Lista de objetos com todos os dados dos participantes
 */

export const formatCsvFile = (file) => {
  const LINE_BREAK = '\n';
  const lines = file.split(LINE_BREAK);

  lines.shift();

  return lines
    .map((line) => line.split(';'))
    .filter(([ispb]) => ispb)
    .map((data) => {
      return {
        ispb: data[0],
        nome: data[1],
        nome_reduzido: data[2],
        modalidade_participacao: data[3],
        tipo_participacao: data[4],
        inicio_operacao: data[5],
      };
    })
    .filter(Boolean);
};

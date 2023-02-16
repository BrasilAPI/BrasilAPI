import axios from 'axios';
import { formatDate, getNow } from '../date';

const API_URL = `https://www.bcb.gov.br/content/estabilidadefinanceira/spi/participantes-spi-`;

const buildDate = () => {
  const now = getNow();
  return formatDate(now, 'YYYYMMDD');
};

export const getParticipants = async () => {
  const url = `${API_URL}${buildDate()}.csv`;
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
        nomeReduzido: data[2],
        modalidadeParticipacao: data[3],
        tipoParticipacao: data[4],
        inicioOperacao: data[5],
      };
    })
    .filter(Boolean);
};

import axios from 'axios';
import { formatDate, getNow } from '../date';

const API_URL = `https://www.bcb.gov.br/content/estabilidadefinanceira/spi/participantes-spi-`;

const buildDate = () => {
  const now = getNow();
  return formatDate(now, 'YYYYMMDD');
};

const getParticipants = async () => {
  const csvPix = await axios.get(`${API_URL}${buildDate()}.csv`);
  return csvPix.data;
};

/**
 * Parse dos dados obtidos do Banco Central
 *
 * @param {string} file CSV - Participantes do PIX
 * @returns Lista de objetos com todos os dados dos participantes
 */

const formatCsvFile = (file) => {
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

/**
 *
 * @returns Lista de objetos com todos os dados dos participantes
 */
export const participants = async () => {
  const data = await getParticipants();

  return formatCsvFile(data);
};

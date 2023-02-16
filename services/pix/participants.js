import axios from 'axios';

const API_URL = `https://www.bcb.gov.br/content/estabilidadefinanceira/spi/participantes-spi-`;

/**
 * Insere um 0 em meses <= 9 e em dias <= 9
 *
 * @param {string} value
 * @returns
 */
const leadingZero = (value) => {
  if (value > 9) return value;

  return `0${value}`;
};

const buildDate = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = leadingZero(now.getMonth() + 1);
  const day = leadingZero(now.getDate());

  return `${year}${month}${day}`;
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

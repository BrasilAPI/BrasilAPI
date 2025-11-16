import BaseError from '@/errors/BaseError';
import axios from 'axios';
import { formatDate, getNow } from '../date';
/**
 * New url format: https://www.bcb.gov.br/content/estabilidadefinanceira/participantes_pix/lista-participantes-instituicoes-em-adesao-pix-20251114.csv
 */
const API_URL = `https://www.bcb.gov.br/content/estabilidadefinanceira/participantes_pix/lista-participantes-instituicoes-em-adesao-pix-`;

const buildDate = (now = getNow()) => formatDate(now.toDate(), 'YYYYMMDD');

function isEqual(requiredHeaders, headers) {
  if (!Array.isArray(requiredHeaders) || !Array.isArray(headers)) {
    return false;
  }
  const headerSet = new Set(headers);
  return requiredHeaders.every((h) => headerSet.has(h));
}

export const getPixParticipants = async (fromToday = true, daysBefore = 1) => {
  const date = fromToday
    ? buildDate()
    : buildDate(getNow().subtract(daysBefore, 'day'));

  const url = `${API_URL}${date}.csv`;
  const csvPix = await axios.get(url, {
    headers: {
      Accept: 'text/csv',
      'accept-encoding': '*',
    },
    responseType: 'arraybuffer',
  });
  const contentType = csvPix.headers['content-type'] || '';
  const charsetMatch = contentType.match(/charset=([^;]+)/i);
  const charset = (charsetMatch && charsetMatch[1].toLowerCase()) || 'latin1'; // fallback

  const decoder = new TextDecoder(charset === 'utf-8' ? 'utf-8' : 'latin1');
  const normalized = decoder.decode(csvPix.data);
  return normalized;
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

  lines.shift(); // Remove a primeira linha que é o cabeçalho (Lista de participantes ativos do Pix)
  const headers = lines
    .shift()
    .split(';')
    .map((header) => header.toLowerCase().replace(/ /g, ''));

  const expectedHeaders = [
    'nomereduzido',
    'ispb',
    'modalidadedeparticipaçãonopix',
    'tipodeparticipaçãonospi',
  ];

  if (!isEqual(expectedHeaders, headers)) {
    throw new BaseError({
      status: 500,
      message: 'Dados e/ou cabeçalho do arquivo estão diferentes/atualizados',
    });
  }

  try {
    return lines
      .map((line) => line.split(';'))
      .filter(([ispb]) => ispb)
      .map((data) => {
        return {
          ispb: data[2],
          nome: data[1],
          nome_reduzido: data[1],
          modalidade_participacao: data[8],
          tipo_participacao: data[6],
          inicio_operacao: null,
        };
      })
      .filter(Boolean);
  } catch (error) {
    throw new BaseError({
      status: 500,
      message: 'Erro ao fazer o parse dos dados',
    });
  }
};

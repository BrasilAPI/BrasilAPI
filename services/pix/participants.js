import BaseError from '@/errors/BaseError';
import axios from 'axios';
import { formatDate, getNow, parseToDate } from '../date';

const API_URL = `https://www.bcb.gov.br/content/estabilidadefinanceira/spi/participantes-spi-`;

const buildDate = (now = getNow()) => formatDate(now, 'YYYYMMDD');

const isEqual = (a, b) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

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

  const headers = lines
    .shift()
    .split(';')
    .map((header) => header.toLowerCase());

  const expectedHeaders = [
    'participantes',
    'nomeParticipante',
    'nomeReduzidoParticipante',
    'modalidadeParticipacaoPix',
    'tipoParticipanteSpi',
    'dataHoraInicioOperacaoSpi',
  ].map((header) => header.toLowerCase());

  if (isEqual(headers, expectedHeaders)) {
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
          ispb: data[0],
          nome: data[1],
          nome_reduzido: data[2],
          modalidade_participacao: data[3],
          tipo_participacao: data[4],
          inicio_operacao: parseToDate(data[5]),
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

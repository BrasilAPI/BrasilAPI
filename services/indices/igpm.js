import InternalError from '@/errors/InternalError';
import axios from 'axios';
import Joi from 'joi';
import { igpmSchema } from './schemas';

const urls = {
  simple: `https://api.bcb.gov.br/dados/serie/bcdata.sgs.189/dados`,
  lastRecords: `https://api.bcb.gov.br/dados/serie/bcdata.sgs.189/dados/ultimos`,
};

const defaultParams = {
  formato: 'json',
};

const fetchData = async (url, params, schema) => {
  try {
    const response = await axios.get(url, {
      params,
    });

    return schema.validateAsync(response.data, { abortEarly: true });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new InternalError({
        message: 'Erro ao obter as informações do BCB - SGS',
      });
    }

    if (Joi.isError(error)) {
      throw new InternalError({
        message: 'Dados inválidos/incompletos no BCB',
      });
    }

    throw new InternalError({
      message: 'Erro ao obter as informações do BCB - SGS',
    });
  }
};

/**
 *
 */
export const getIgpm = async () => {
  const data = await fetchData(urls.simple, defaultParams, igpmSchema);

  return data.map((igpmIndex) => ({
    value: igpmIndex.valor,
    date: igpmIndex.data,
  }));
};

/**
 * Busca todos os registro dentro de um periodo
 * @param {Date} initialDate Data inicial do intervalo
 * @param {Date} endDate Data final do intervalo
 */
export const getIgpmByPeriod = async (initialDate, endDate) => {
  const data = await fetchData(
    urls.simple,
    { ...defaultParams, dataInicial: initialDate, dataFinal: endDate },
    igpmSchema
  );

  return data.map((igpmIndex) => ({
    value: igpmIndex.valor,
    date: igpmIndex.data,
  }));
};

/**
 * Busca os ultimos registros de acordo com o número passado.
 * @param {Number} numberOfRecords Quantidade de registros a serem obtidos
 */
export const getIgpmByLastNRecords = async (numberOfRecords = 12) => {
  const data = await fetchData(
    `${urls.lastRecords}/${numberOfRecords}`,
    defaultParams,
    igpmSchema
  );

  return data.map((igpmIndex) => ({
    value: igpmIndex.valor,
    date: igpmIndex.data,
  }));
};

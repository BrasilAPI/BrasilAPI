import axios from 'axios';
import Joi from 'joi';
import InternalError from '@/errors/InternalError';

export const buildUrl = {
  simple: (code) =>
    `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${code}/dados`,
  lastRecords: (code, numberOfRecords) =>
    `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${code}/dados/ultimos/${numberOfRecords}`,
};

const defaultParams = {
  formato: 'json',
};

export const fetchData = async (url, schema, params = {}) => {
  try {
    const response = await axios.get(url, {
      params: {
        ...defaultParams,
        ...params,
      },
    });

    return schema.validateAsync(response.data, { abortEarly: true });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new InternalError({
        message: 'Erro ao obter as informações do BCB - SGS',
        type: 'INTERNAL',
        name: 'IGPM_LIST_ERROR',
      });
    }

    if (Joi.isError(error)) {
      throw new InternalError({
        message: 'Dados inválidos/incompletos no BCB',
        type: 'INTERNAL',
        name: 'IGPM_LIST_ERROR',
      });
    }

    throw new InternalError({
      message: 'Erro ao obter as informações do BCB - SGS',
      type: 'INTERNAL',
      name: 'IGPM_LIST_ERROR',
    });
  }
};

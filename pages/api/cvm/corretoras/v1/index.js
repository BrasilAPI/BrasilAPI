import app from '@/app';

import BadRequestError from '@/errors/BadRequestError';
import BaseError from '@/errors/BaseError';

import InternalError from '@/errors/InternalError';
import { getExchangesData } from '../../../../../services/cvm/corretoras';

const action = async (request, response) => {
  try {
    const allExchangesData = await getExchangesData();

    const { uf } = request.query;

    if (uf !== undefined) {
      const normalizedUf = String(uf).toUpperCase();

      if (!/^[A-Z]{2}$/.test(normalizedUf)) {
        throw new BadRequestError({
          message: 'UF inválida. Informe a sigla do estado (ex: SP).',
          type: 'validation_error',
        });
      }

      return response
        .status(200)
        .json(
          allExchangesData.filter(
            (exchange) => String(exchange.uf).toUpperCase() === normalizedUf
          )
        );
    }

    return response.status(200).json(allExchangesData);
  } catch (err) {
    if (err instanceof BaseError) {
      throw err;
    }

    throw new InternalError({
      message: 'Erro ao buscar informações sobre corretora',
      type: 'exchange_error',
      name: 'EXCHANGE_INTERNAL',
    });
  }
};

export default app({ cache: 86400 }).get(action);

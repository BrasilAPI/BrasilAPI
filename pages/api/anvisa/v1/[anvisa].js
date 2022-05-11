import app from '@/app';

import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';

import { getProtocolAnvisa, getAnvisa } from '@/services/anvisa';

async function anvisa(request, response, next) {
  try {
    const { code: queryString } = request.query;
    const protocolData = await (await getProtocolAnvisa(queryString)).json();

    if (!protocolData.content[0]) {
      return response.status(404).json({
        message: `Protocolo do ANVISA ${queryString} não encontrado.`,
      });
    }

    const { processo: protocol } = protocolData.content[0];

    const recordData = await (await getAnvisa(protocol)).json();

    return response.status(200).json(recordData);
  } catch (error) {
    if (error instanceof BaseError) {
      return next(error);
    }
    throw new InternalError({
      message: 'O serviço de consulta da Anvisa retornou um erro.',
      type: 'service_error',
    });
  }
}

export default app().get(anvisa);

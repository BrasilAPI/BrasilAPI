import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import NotFoundError from '@/errors/NotFoundError';
import { getExchangeBetweenCurrencies } from '@/services/currency';

async function getExchange(request, response) {
  const { from, to } = request.query;

  if (!from) {
    throw new BadRequestError({
      message: `Parameter from is required`,
    });
  }

  if (!to) {
    throw new BadRequestError({
      message: `Parameter to is required`,
    });
  }

  try {
    const exchange = await getExchangeBetweenCurrencies(from, to);
    return response.json(exchange);
  } catch (error) {
    if (error.response.status === 404) {
      throw new NotFoundError({
        message: `Cannot found any exchange between ${from} and ${to}`,
      });
    }

    throw error;
  }
}

export default app().get(getExchange);

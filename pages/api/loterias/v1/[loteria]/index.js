import app from '@/app';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import { getLastResult } from '@/services/loterias';

async function getLastLotteryResult(request, response) {
  try {
    const { loteria } = request.query;

    const result = await getLastResult(loteria);

    return response.status(200).json(result);
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new InternalError({
      message: 'Error fetching lottery result.',
      type: 'lottery_error',
    });
  }
}

export default app().get(getLastLotteryResult);

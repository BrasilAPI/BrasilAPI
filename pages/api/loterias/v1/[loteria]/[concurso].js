import app from '@/app';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import { getResultByDraw } from '@/services/loterias';

async function getLotteryDrawResult(request, response) {
  try {
    const { loteria, concurso } = request.query;

    const result = await getResultByDraw(loteria, concurso);

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

export default app().get(getLotteryDrawResult);

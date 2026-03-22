import app from '@/app';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import { getNewYearDraw } from '@/services/loterias';

async function getNewYearDrawByYear(request, response) {
  try {
    const { ano } = request.query;

    const result = await getNewYearDraw(ano);

    return response.status(200).json(result);
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new InternalError({
      message: "Error fetching New Year's draw.",
      type: 'lottery_error',
    });
  }
}

export default app().get(getNewYearDrawByYear);

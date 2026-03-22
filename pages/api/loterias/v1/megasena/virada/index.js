import app from '@/app';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import { getNewYearDraw } from '@/services/loterias';

async function getCurrentYearNewYearDraw(request, response) {
  try {
    // Fetch the New Year's draw for the current year
    const currentYear = new Date().getFullYear();
    const result = await getNewYearDraw(currentYear);

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

export default app().get(getCurrentYearNewYearDraw);

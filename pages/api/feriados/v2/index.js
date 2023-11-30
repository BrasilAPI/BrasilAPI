import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import NotFoundError from '@/errors/NotFoundError';
import { getNationalHolidays } from '@/services/holidays/v2';

async function nationalHolidays(request, response) {
  try {
    const result = await getNationalHolidays()
    return response.json(result)
  } catch (error) {
    if (error.response.status === 400) {
      throw new BadRequestError({ message: error.response.data.message });
    }
    if (error.response.status === 404) {
      throw new NotFoundError({ message: error.response.data.message });
    }
    throw error;
  }
}

export default app().get(nationalHolidays);
import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import NotFoundError from '@/errors/NotFoundError';
import { getHolidaysByState } from '@/services/holidays/v2';

async function holidaysByState(request, response) {
  try {
    let { year } = request.query;

    if (year === undefined) {
      year = new Date().getFullYear();
    }

    const { state } = request.query;
    const result = await getHolidaysByState(state, year);
    return response.json(result);
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

export default app().get(holidaysByState);

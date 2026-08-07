import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import NotFoundError from '@/errors/NotFoundError';
import {
  getSolarIncidence,
  LocationNotFoundError,
} from '@/services/solarIncidenceService';

const action = async (request, response) => {
  const { location } = request.query;

  if (!location) {
    throw new BadRequestError({ message: 'Informe uma localização' });
  }

  try {
    const data = await getSolarIncidence(location);

    return response.status(200).json(data);
  } catch (error) {
    if (error instanceof LocationNotFoundError) {
      throw new NotFoundError({ message: error.message });
    }

    throw error;
  }
};

export default app({ cache: 86400 }).get(action);

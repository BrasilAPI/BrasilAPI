import app from '@/app';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import getHolidays from '@/services/holidays-v2';

const action = async (request, response) =>  {
  try {
    if(!('estado' in request.query)) {
        request.query.estado = '';
    }
    if(!('cidade' in request.query)) {
        request.query.cidade = '';
    }
    const holidays = await getHolidays(request.query.cidade, request.query.estado, request.query.ano);

    response.status(200).json(holidays);
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new InternalError({
      message: 'Erro ao calcular feriados.',
      type: 'feriados_error',
    });
  }
};

export default app().get(action);
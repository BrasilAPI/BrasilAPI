import app from '@/app';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import BadRequestError from '@/errors/BadRequestError';
import getHolidays from '@/services/holidays';

async function getHolidaysByYear(request, response) {
  try {
    const { ano, uf } = request.query;
    const holidays = getHolidays(ano, uf);

    return response.status(200).json(holidays);
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    if (error.message === 'Estado inválido') {
      throw new BadRequestError({
        message: 'UF inválida. Informe uma sigla válida (ex: SP, RJ, MG).',
        type: 'invalid_uf',
      });
    }

    throw new InternalError({
      message: 'Erro ao calcular feriados.',
      type: 'feriados_error',
    });
  }
}

export default app().get(getHolidaysByYear);

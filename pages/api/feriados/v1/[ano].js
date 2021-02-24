import microCors from 'micro-cors';
import getHolidays from '../../../../services/holidays';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

const action = (request, response) => {
  try {
    const holidays = getHolidays(request.query.ano);

    response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);
    response.status(200).json(holidays);
  } catch (error) {
    if (error.message === 'Cannot calculate holidays.') {
      response.status(404).json({
        type: 'feriados_range_error',
        message: 'Ano fora do intervalo suportado entre 1900 e 2199.',
      });
    } else {
      response.status(500).json({
        type: 'feriados_error',
        message: 'Erro ao calcular feriados.',
      });
    }
  }
};

export default cors(action);

import { getBrazilianHolidays } from 'brazilian-holidays';
import microCors from 'micro-cors';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate';
const cors = microCors();

// retorna feriados brasileiros pelo ano
// exemplo da rota: /api/cities/v1/ddd/21

async function HolidaysByYear(request, response) {
  const { year } = request.query;

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  try {
    const holidays = await getBrazilianHolidays(year);

    response.status(200);
    response.json(holidays);
  } catch (error) {
    response.status(500);
    response.json(error);
  }
}

export default cors(HolidaysByYear);

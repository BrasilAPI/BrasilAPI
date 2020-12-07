import microCors from 'micro-cors';
import bm from 'business-moment';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate';
const cors = microCors();

async function HolidaysByDate(request, response) {
  const { date } = request.query;
  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  try {
    const isBusinessDay = await bm.isBusinessDay('brazil', date);
    const nextBusinessDay = await bm.nextBusinessDay('brazil', date);
    const queryDateInformation = await bm.queryDateInformation('brazil', date);

    return response
      .status(200)
      .json({ queryDateInformation, isBusinessDay, nextBusinessDay });
  } catch (error) {
    if (error.isOperational) {
      return response.status(404).json(error);
    }
    return response.status(500).json(error);
  }
}

export default cors(HolidaysByDate);

require("dotenv").config();
import microCors from 'micro-cors';
import axios from "axios"

const CACHE_CONTROL_HEADER_VALUE = 'max-age=0, s-maxage=86400, stale-while-revalidate';
const cors = microCors();

async function HolidaysByYear(request, response) {
  const requestedYear = request.query.holiday;
  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  try {
    const requestURL = `https://api.calendario.com.br/?json=true&ano=${requestedYear}&token=${process.env.CALENDARIO_API_TOKEN}`
    const holidaysResult = await axios.get(requestURL)

    response.status(200);
    response.json(holidaysResult.data);

  } catch (error) {
      if (error.name === 'citiesPromiseError') {
          response.status(404);
          response.json(error);
          return;
      }

      response.status(500);
      response.json(error);
  }
}

export default cors(HolidaysByYear);

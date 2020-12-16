import microCors from 'micro-cors';

import { getCurrentAirportWeather } from '../../../../../../services/cptec/weather';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

const action = async (request, response) => {
    const icaoCode = request.query.airport;
    const airportWeather = await getCurrentAirportWeather(icaoCode);

    response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

    if (!airportWeather) {
        response.status(404);
        response.json({
          message: 'Condições meteorológicas ou aeroporto não localizados',
          type: 'AIRPORT_CONDITIONS_NOT_FOUND',
        });
    
        return;
      }
  
    response.status(200);
    response.json(airportWeather);
};

export default cors(action);

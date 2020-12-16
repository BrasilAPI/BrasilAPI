import microCors from 'micro-cors';
import {getAllCitiesData} from '../../../../../services/cptec';


const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

const action = async (request, response)  => {
    const allCitiesData = await getAllCitiesData();

    response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);
  
    response.status(200);
    response.json(allCitiesData);
}

export default cors(action);

import microCors from 'micro-cors';
import { getMusicData } from '../../../../../../services/vagalume';

// Explicação sobre esse header no arquivo api/cep/v1/[cep].js
const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';

const cors = microCors();

async function GetMusic(request, response) {
  const { artist, music } = request.query;

  const musicResponse = await getMusicData(artist, music);

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  if (/NOT_FOUND$/.test(music.type)) response.status(404);

  return response.json(musicResponse);
}

export default cors(GetMusic);

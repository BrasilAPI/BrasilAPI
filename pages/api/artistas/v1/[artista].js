import microCors from 'micro-cors';
import { getArtistData } from '../../../../services/vagalume';

// Explicação sobre esse header no arquivo api/cep/v1/[cep].js
const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';

const cors = microCors();

async function GetArtist(request, response) {
  const artista = request.query.artista;
  const artistData = await getArtistData(artista);

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  if (artistData.type === 'ARTIST_NOT_FOUND') response.status(404);

  return response.json(artistData);
}

export default cors(GetArtist);

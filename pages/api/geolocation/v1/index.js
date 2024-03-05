import microCors from 'micro-cors';
import Axios from 'axios';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

function validateGeolocation(latitude = '', longitude = '') {
  const latitudeRegex = new RegExp(
    /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/
  );
  const longitudeRegex = new RegExp(
    /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/
  );

  if (latitude.match(latitudeRegex) && longitude.match(longitudeRegex)) {
    return true;
  }

  return false;
}

async function Geolocation(request, response) {
  const defaultLanguage = 'pt';
  const { latitude, longitude, language } = request.query;
  const clientIp =
    request.headers['x-forwarded-for'] || request.connection.remoteAddress;

  console.log({
    url: request.url,
    clientIp,
  });

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  const isValidGeolocation = validateGeolocation(latitude, longitude);

  if (!isValidGeolocation) {
    response.status(400);
    return response.json({
      error: 'Invalid gelocation',
      message: 'an invalid geolocation was reported',
    });
  }

  try {
    const result = await Axios.get(
      `
      https://api.bigdatacloud.net/data/reverse-geocode-client
    `,
      {
        params: {
          latitude,
          longitude,
          localityLanguage: language || defaultLanguage,
        },
      }
    );

    const { city, countryName } = result.data;

    return response.json({ city, country: countryName });
  } catch (error) {
    response.status(500);
    response.json(error);
  }
}

export default cors(Geolocation);

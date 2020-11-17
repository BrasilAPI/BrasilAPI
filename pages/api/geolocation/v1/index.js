import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';

import axios from 'axios';

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

async function geolocation(request, response) {
  const defaultLanguage = 'pt';
  const { latitude, longitude, language } = request.query;

  const isValidGeolocation = validateGeolocation(latitude, longitude);

  if (!isValidGeolocation) {
    throw new BadRequestError({
      message: 'Geolocalização inválida',
    });
  }

  try {
    const result = await axios.get(
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
    throw new InternalError({
      message: 'Erro ao buscar informações sobre a geolocalização',
    });
  }
}

export default app().get(geolocation);

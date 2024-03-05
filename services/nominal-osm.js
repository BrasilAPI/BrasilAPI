import axios from 'axios';

const BASE_URL = 'https://nominatim.openstreetmap.org/search';

const https = require('https');

let cacheAgent;

function getAgent() {
  if (!cacheAgent) {
    cacheAgent = new https.Agent({ keepAlive: true });
  }

  return cacheAgent;
}

function emptyLocation() {
  return {
    type: 'Point',
    coordinates: { longitude: undefined, latitude: undefined },
  };
}

async function fetchGeocoordinateFromBrazilLocation({
  state,
  city,
  street,
  cep,
  neighborhood,
}) {
  const agent = getAgent();
  const country = 'Brasil';
  let streetUse = '';

  if (street) {
    if (street.includes('-')) {
      const streetSplit = street.split('-');
      if (streetSplit && streetSplit[0]) {
        streetUse = streetSplit[0];
      }
    } else {
      streetUse = street;
    }
  }

  const headers = {
    'User-Agent': 'brasil-api-cep-v2',
  };

  try {
    const params = {
      country,
      city,
      state,
      treet: streetUse,
      format: 'json',
      addressdetails: 1,
      neighborhood,
    };

    const response = await axios({
      url: BASE_URL,
      method: 'GET',
      params,
      headers,
      httpAgents: agent,
      httpAgent: agent,
    });

    if (!response.data) {
      return emptyLocation();
    }

    const { data } = response;

    const jsonDataWithPostCodes = data.filter(item => item.address.postcode);
    if (!jsonDataWithPostCodes[0]) {
      // get first address
      const firstLocation = data[0];
      return {
        type: 'Point',
        coordinates: {
          longitude: firstLocation.lon,
          latitude: firstLocation.lat,
        },
      };
    }
    const cleanedCep = cep.replace(/\D/g, '');

    const exactLocation = jsonDataWithPostCodes.find(
      (item) => item.address.postcode.replace(/\D/g, '') === cleanedCep
    );

    const approximateLocation = jsonDataWithPostCodes.find(
      (item) =>
        item.address.postcode.replace(/\D/g, '').slice(0, 5) ===
        cleanedCep.slice(0, 5)
    );

    const location = exactLocation || approximateLocation;

    if (!location) {
      return emptyLocation();
    }

    const { lat: latitude, lon: longitude } = location;
    return { type: 'Point', coordinates: { longitude, latitude } };
  } catch (err) {
    emptyLocation();
  }
}

export default fetchGeocoordinateFromBrazilLocation;

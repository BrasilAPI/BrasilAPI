const https = require('https');

let cacheAgent;

function getAgent() {
  if (!cacheAgent) {
    cacheAgent = new https.Agent({ keepAlive: true });
  }

  return cacheAgent;
}

function extractAltFromStreet(street) {
  const regex = /-.*$/gm;
  return street.replace(regex, '').trim();
}

function getRandomUserAgent() {
  const number = Math.floor(Math.random() * 10);
  return `brasil-api-cep-v2-${number}`;
}

function onlyDigits(value) {
  return String(value).replace(/\D/g, '');
}

function findLocationByCep(locations, cep) {
  if (!cep) {
    return locations[0];
  }

  const cleanedCep = onlyDigits(cep);
  const locationsWithPostCodes = locations.filter(
    (item) => item.address?.postcode
  );

  const exactLocation = locationsWithPostCodes.find(
    (item) => onlyDigits(item.address.postcode) === cleanedCep
  );

  if (exactLocation) {
    return exactLocation;
  }

  return locationsWithPostCodes.find(
    (item) => onlyDigits(item.address.postcode).slice(0, 5) ===
      cleanedCep.slice(0, 5)
  );
}

function parseLocation(location) {
  const unavailableCoordinate = {
    type: 'Point',
    coordinates: { longitude: undefined, latitude: undefined },
  };

  if (!location) {
    return unavailableCoordinate;
  }

  const { lat: latitude, lon: longitude } = location;
  return { type: 'Point', coordinates: { longitude, latitude } };
}

async function fetchGeocoordinateFromBrazilLocation({
  state,
  city,
  street,
  cep,
}) {
  const unavailableCoordinate = {
    type: 'Point',
    coordinates: { longitude: undefined, latitude: undefined },
  };
  const agent = getAgent();
  const headers = new Headers({
    'User-Agent': getRandomUserAgent(),
  });
  const requestConfig = {
    agent,
    headers,
    signal: AbortSignal.timeout(2000),
  };
  const cleanedCep = cep ? onlyDigits(cep) : null;
  const queryParams = new URLSearchParams({
    format: 'jsonv2',
    addressdetails: '1',
    limit: '10',
    country: 'Brasil',
    state,
    city,
  });

  if (street) {
    queryParams.set('street', extractAltFromStreet(street));
  }

  if (cleanedCep) {
    queryParams.set('postalcode', cleanedCep);
  }

  let response = await fetch(
    `https://nominatim.openstreetmap.org/search?${queryParams.toString()}`,
    requestConfig
  ).catch(() => {
    return { ok: false };
  });

  if (!response?.ok) {
    return unavailableCoordinate;
  }

  let locations = await response.json();
  let location = findLocationByCep(locations, cep);

  if (!location && street && cleanedCep) {
    queryParams.delete('street');

    response = await fetch(
      `https://nominatim.openstreetmap.org/search?${queryParams.toString()}`,
      requestConfig
    ).catch(() => {
      return { ok: false };
    });

    if (response?.ok) {
      locations = await response.json();
      location = findLocationByCep(locations, cep);
    }
  }

  if (!location) {
    return unavailableCoordinate;
  }

  return parseLocation(location);
}

export default fetchGeocoordinateFromBrazilLocation;

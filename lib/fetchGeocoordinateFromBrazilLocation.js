import https from 'https';

let cacheAgent;

function getAgent() {
  if (!cacheAgent) {
    cacheAgent = new https.Agent({ keepAlive: true });
  }

  return cacheAgent;
}

function extractAltFromStreet(street) {
  const regex = /-.*$/gm;
  return String(street ?? '')
    .replace(regex, '')
    .trim();
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
    (item) => item.properties?.postcode
  );

  const exactLocation = locationsWithPostCodes.find(
    (item) => onlyDigits(item.properties.postcode) === cleanedCep
  );

  if (exactLocation) {
    return exactLocation;
  }

  return locationsWithPostCodes.find(
    (item) =>
      onlyDigits(item.properties.postcode).slice(0, 5) ===
      cleanedCep.slice(0, 5)
  );
}

function parseLocation(location) {
  const unavailableCoordinate = {
    type: 'Point',
    coordinates: { longitude: null, latitude: null },
  };

  if (!location) {
    return unavailableCoordinate;
  }

  const [longitude, latitude] = location.geometry?.coordinates ?? [];

  if (longitude == null || latitude == null) {
    return unavailableCoordinate;
  }

  return {
    type: 'Point',
    coordinates: { longitude: String(longitude), latitude: String(latitude) },
  };
}

const PHOTON_API_URL = 'https://photon.komoot.io/api/';
const PHOTON_TIMEOUT_MS = 3000;

async function fetchPhoton(query) {
  const queryParams = new URLSearchParams({
    q: query,
    limit: '10',
  });

  const requestConfig = {
    agent: getAgent(),
    headers: new Headers({
      'User-Agent': getRandomUserAgent(),
    }),
    signal: AbortSignal.timeout(PHOTON_TIMEOUT_MS),
  };

  const response = await fetch(
    `${PHOTON_API_URL}?${queryParams.toString()}`,
    requestConfig
  ).catch(() => {
    return { ok: false };
  });

  if (!response?.ok) {
    return [];
  }

  try {
    const body = await response.json();
    return Array.isArray(body?.features) ? body.features : [];
  } catch {
    return [];
  }
}

async function fetchGeocoordinateFromBrazilLocation({
  state,
  city,
  street,
  cep,
}) {
  const unavailableCoordinate = {
    type: 'Point',
    coordinates: { longitude: null, latitude: null },
  };
  const cleanedCep = cep ? onlyDigits(cep) : null;
  const query = [extractAltFromStreet(street), city, state, cleanedCep]
    .filter(Boolean)
    .join(', ');

  let locations = await fetchPhoton(query);
  let location = findLocationByCep(locations, cep);

  if (!location && street && cleanedCep) {
    const retryQuery = [city, state, cleanedCep].filter(Boolean).join(', ');
    locations = await fetchPhoton(retryQuery);
    location = findLocationByCep(locations, cep);
  }

  if (!location) {
    return unavailableCoordinate;
  }

  return parseLocation(location);
}

export default fetchGeocoordinateFromBrazilLocation;

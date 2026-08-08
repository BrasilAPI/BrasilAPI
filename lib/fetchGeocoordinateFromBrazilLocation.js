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
const OPEN_METEO_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const GEOCODING_TIMEOUT_MS = 2000;

async function fetchJson(url) {
  const requestConfig = {
    agent: getAgent(),
    headers: new Headers({
      'User-Agent': getRandomUserAgent(),
    }),
    signal: AbortSignal.timeout(GEOCODING_TIMEOUT_MS),
  };

  const response = await fetch(url, requestConfig).catch(() => {
    return { ok: false };
  });

  if (!response?.ok) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function fetchPhoton(query) {
  const queryParams = new URLSearchParams({
    q: query,
    limit: '10',
  });

  const body = await fetchJson(`${PHOTON_API_URL}?${queryParams.toString()}`);

  return Array.isArray(body?.features) ? body.features : [];
}

async function fetchOpenMeteo(city, state) {
  const queryParams = new URLSearchParams({
    name: [city, state].filter(Boolean).join(', '),
    count: '5',
    language: 'pt',
    format: 'json',
  });

  const body = await fetchJson(
    `${OPEN_METEO_API_URL}?${queryParams.toString()}`
  );
  const results = Array.isArray(body?.results) ? body.results : [];

  return results
    .filter((item) => item.latitude != null && item.longitude != null)
    .map((item) => ({
      geometry: {
        coordinates: [item.longitude, item.latitude],
      },
    }));
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
  const retryQuery =
    street && cleanedCep
      ? [city, state, cleanedCep].filter(Boolean).join(', ')
      : null;

  const [locations, retryLocations, openMeteoLocations] = await Promise.all([
    fetchPhoton(query),
    retryQuery ? fetchPhoton(retryQuery) : Promise.resolve([]),
    fetchOpenMeteo(city, state),
  ]);

  const location =
    findLocationByCep(locations, cep) ||
    (retryQuery ? findLocationByCep(retryLocations, cep) : undefined) ||
    openMeteoLocations[0];

  if (!location) {
    return unavailableCoordinate;
  }

  return parseLocation(location);
}

export default fetchGeocoordinateFromBrazilLocation;

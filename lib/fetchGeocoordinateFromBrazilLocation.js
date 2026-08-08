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
    coordinates: { longitude: undefined, latitude: undefined },
  };

  if (!location) {
    return unavailableCoordinate;
  }

  const [longitude, latitude] = location.geometry?.coordinates ?? [];

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
    signal: AbortSignal.timeout(3000),
  };
  const cleanedCep = cep ? onlyDigits(cep) : null;
  const query = [extractAltFromStreet(street), city, state, cleanedCep]
    .filter(Boolean)
    .join(', ');
  const queryParams = new URLSearchParams({
    q: query,
    limit: '10',
  });

  let response = await fetch(
    `https://photon.komoot.io/api/?${queryParams.toString()}`,
    requestConfig
  ).catch(() => {
    return { ok: false };
  });

  if (!response?.ok) {
    return unavailableCoordinate;
  }

  let locations = (await response.json()).features;
  let location = findLocationByCep(locations, cep);

  if (!location && street && cleanedCep) {
    const retryQuery = [city, state, cleanedCep].filter(Boolean).join(', ');
    queryParams.set('q', retryQuery);

    response = await fetch(
      `https://photon.komoot.io/api/?${queryParams.toString()}`,
      requestConfig
    ).catch(() => {
      return { ok: false };
    });

    if (response?.ok) {
      locations = (await response.json()).features;
      location = findLocationByCep(locations, cep);
    }
  }

  if (!location) {
    return unavailableCoordinate;
  }

  return parseLocation(location);
}

export default fetchGeocoordinateFromBrazilLocation;

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

async function fetchGeocoordinateFromBrazilLocation({
  state,
  city,
  street,
  cep,
}) {
  const agent = getAgent();
  const encodedState = encodeURI(state);
  const encodedCity = encodeURI(city);
  const encodedStreet = encodeURI(extractAltFromStreet(street));

  const country = 'Brasil';
  const queryString = `format=json&addressdetails=1&country=${country}&state=${encodedState}&city=${encodedCity}&street=${encodedStreet}`;

  const headers = new Headers({
    'User-Agent': 'brasil-api-cep-v2',
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${queryString}`,
    {
      agent,
      headers,
    }
  );

  const jsonData = await response.json();

  const jsonDataWithPostCodes = jsonData.filter(
    (item) => item.address.postcode
  );

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
    return {
      type: 'Point',
      coordinates: { longitude: undefined, latitude: undefined },
    };
  }

  const { lat: latitude, lon: longitude } = location;
  return { type: 'Point', coordinates: { longitude, latitude } };
}

export default fetchGeocoordinateFromBrazilLocation;

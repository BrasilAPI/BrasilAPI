const https = require('https');

let cacheAgent;

function getAgent() {
  if (!cacheAgent) {
    cacheAgent = new https.Agent({ keepAlive: true });
  }

  return cacheAgent;
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
  const encodedStreet = encodeURI(street);

  const country = 'Brasil';
  const queryString = `format=json&addressdetails=1&country=${country}&state=${encodedState}&city=${encodedCity}&street=${encodedStreet}`;

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search/?${queryString}`,
    { agent }
  );

  const jsonData = await response.json();

  const cleanedCep = cep.replace(/\D/g, '');
  const exactLocation = jsonData.find(
    (item) => item.address.postcode.replace(/\D/g, '') === cleanedCep
  );
  const approximateLocation = jsonData.find(
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

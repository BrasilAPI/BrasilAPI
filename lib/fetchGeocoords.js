const https = require('https');

let cacheAgent;

function getAgent() {
  if (!cacheAgent) {
    cacheAgent = new https.Agent({ keepAlive: true });
  }

  return cacheAgent;
}

async function fetchGeocoordinateFromBrazilLocation({ state, city, street }) {
  const agent = getAgent();
  const encodedState = encodeURI(state);
  const encodedCity = encodeURI(city);
  const encodedStreet = encodeURI(street);

  const country = 'Brasil';
  const queryString = `format=json&addressdetails=1&country=${country}&state=${encodedState}&city=${encodedCity}&street=${encodedStreet}&limit=1`;

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search/?${queryString}`,
    { agent }
  );

  const jsonData = await response.json();

  if (jsonData.length > 0) {
    const { lat: latitude, lon: longitude } = jsonData[0];
    return { type: 'Point', coordinates: { longitude, latitude } };
  }

  return {
    type: 'Point',
    coordinates: { longitude: undefined, latitude: undefined },
  };
}

export default fetchGeocoordinateFromBrazilLocation;

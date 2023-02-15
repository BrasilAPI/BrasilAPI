const https = require('https');

let cacheAgent;

function getAgent() {
  if (!cacheAgent) {
    cacheAgent = new https.Agent({ keepAlive: true });
  }

  return cacheAgent;
}

async function fetchGeocoordinateFromBrazilLocation({ cep }) {
  const agent = getAgent();

  const country = 'Brasil';
  const queryString = `format=json&addressdetails=1&country=${country}&postalcode=${cep}&limit=1`;

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

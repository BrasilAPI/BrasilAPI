const https = require('https');

let cacheAgent;

function getAgent() {
  if (!cacheAgent) {
    cacheAgent = new https.Agent({ keepAlive: true });
  }

  return cacheAgent;
}

function extractAltFromStreet(street) {
<<<<<<< HEAD
<<<<<<< HEAD
  const regex = /-.*$/gm;
  return street.replace(regex, '').trim();
=======
  const regex = /\-.*$/gm
  return street.replace(regex, '').trim()
>>>>>>> d64d02a (:bug: fix: Adicionando funcionalidade para remover alt da rua. Preservando nome principal da rua.)
=======
  const regex = /-.*$/gm;
  return street.replace(regex, '').trim();
>>>>>>> 039a4bc (:bricks: ci: utilizando modelo orientado pelo enlist.)
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
<<<<<<< HEAD
<<<<<<< HEAD
  const encodedStreet = encodeURI(extractAltFromStreet(street));
=======
  street = extractAltFromStreet(street)
  const encodedStreet = encodeURI(street);
>>>>>>> d64d02a (:bug: fix: Adicionando funcionalidade para remover alt da rua. Preservando nome principal da rua.)
=======
  const encodedStreet = encodeURI(extractAltFromStreet(street));
>>>>>>> 039a4bc (:bricks: ci: utilizando modelo orientado pelo enlist.)

  const country = 'Brasil';
  const queryString = `format=json&addressdetails=1&country=${country}&state=${encodedState}&city=${encodedCity}&street=${encodedStreet}`;

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${queryString}`,
    { agent }
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

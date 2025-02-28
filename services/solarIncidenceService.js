import axios from 'axios';

// Função para converter localização em coordenadas
const getCoordinates = async (location) => {
  const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);
  const data = response.data[0];
  return { lat: data.lat, lon: data.lon };
};

export const getSolarIncidence = async (location) => {
  try {
    const { lat, lon } = await getCoordinates(location);
    const response = await axios.get(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`);
    return response.data.results;
  } catch (error) {
    throw new Error('Could not fetch data');
  }
};

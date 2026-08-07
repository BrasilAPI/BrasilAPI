import axios from 'axios';

// O nominatim exige um User-Agent identificável (bloqueia requests sem UA)
const NOMINATIM_HEADERS = {
  'User-Agent': 'brasilapi.com.br (contato@brasilapi.com.br)',
};

export class LocationNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LocationNotFoundError';
  }
}

// Função para converter localização em coordenadas
const getCoordinates = async (location) => {
  const response = await axios.get(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      location
    )}`,
    { headers: NOMINATIM_HEADERS }
  );

  if (!response.data || response.data.length === 0) {
    throw new LocationNotFoundError('Localização não encontrada');
  }

  const { lat, lon } = response.data[0];

  return { lat, lon };
};

export const getSolarIncidence = async (location) => {
  const { lat, lon } = await getCoordinates(location);
  const response = await axios.get(
    `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`
  );

  return response.data.results;
};

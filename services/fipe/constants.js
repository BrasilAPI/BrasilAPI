import axios from 'axios';

export const VEHICLE_TYPE = {
  CAR: 1,
  MOTORCYCLE: 2,
  TRUCK: 3,
};

export const FIPE_URL = 'https://veiculos.fipe.org.br/api';

// Injeta os headers necessários automaticamente em todas as requisições para a FIPE
axios.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith(FIPE_URL)) {
    config.headers['User-Agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
    config.headers['Referer'] = 'https://veiculos.fipe.org.br/';
  }
  return config;
});

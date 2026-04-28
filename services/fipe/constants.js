import axios from 'axios';

export const VEHICLE_TYPE = {
  CAR: 1,
  MOTORCYCLE: 2,
  TRUCK: 3,
};

const fipeApi = axios.create({
  baseURL: 'https://veiculos.fipe.org.br/api',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    Referer: 'https://veiculos.fipe.org.br/',
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function resilientPost(url, data, retryCount = 0) {
  try {
    // Adiciona um pequeno delay inicial para evitar rajadas
    await sleep(500 * (retryCount + 1));
    
    const response = await fipeApi.post(url, data);
    
    // Cloudflare às vezes retorna 200 mas com HTML de desafio
    if (typeof response.data === 'string' && response.data.includes('cf-chl-opt')) {
      throw { response: { status: 403, data: response.data } };
    }
    
    return response;
  } catch (error) {
    const status = error.response ? error.response.status : null;
    
    if ((status === 403 || status === 429 || !status) && retryCount < 5) {
      const delay = Math.pow(2, retryCount) * 2000;
      console.log(`[FIPE] Request to ${url} failed with status ${status}. Retrying in ${delay}ms... (Attempt ${retryCount + 1}/5)`);
      await sleep(delay);
      return resilientPost(url, data, retryCount + 1);
    }
    
    console.error(`[FIPE] Request to ${url} failed permanently with status ${status}`);
    throw error;
  }
}

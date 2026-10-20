import axios from 'axios';

import { FIPE_URL } from './constants';

// Headers de navegador: o WAF do veiculos.fipe.org.br bloqueia chamadas
// sem fingerprint de browser vindo de IPs de datacenter (Vercel).
export const FIPE_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  Accept: 'application/json, text/plain, */*',
  Referer: 'https://veiculos.fipe.org.br/',
  Origin: 'https://veiculos.fipe.org.br',
  'Content-Type': 'application/x-www-form-urlencoded',
};

// Tenta o upstream oficial; em falha de bloqueio (403/429), erro de
// servidor (5xx) ou falha de rede, delega para o fallback parallelum.
export async function fipePost(path, body, fallback) {
  try {
    const { data } = await axios.post(`${FIPE_URL}${path}`, body, {
      headers: FIPE_HEADERS,
    });

    // O upstream às vezes responde 200 com HTML de desafio do Cloudflare.
    if (typeof data === 'string' && data.includes('cf-chl-opt')) {
      const cfError = new Error('Cloudflare challenge detected');
      cfError.response = { status: 403, data };
      throw cfError;
    }

    return { data };
  } catch (error) {
    const status = error?.response?.status;

    if (
      fallback &&
      (status === 403 || status === 429 || !status || status >= 500)
    ) {
      const data = await fallback();

      return { data };
    }

    throw error;
  }
}

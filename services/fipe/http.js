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

export function fipePost(path, body) {
  return axios.post(`${FIPE_URL}${path}`, body, { headers: FIPE_HEADERS });
}

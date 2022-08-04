import axios from 'axios';

export default function getRegistroBrAvail(domain) {
  return axios.get(`https://registro.br/v2/ajax/avail/raw/${domain}`);
}

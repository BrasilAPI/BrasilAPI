import axios from 'axios';

export const getCnpjData = (cnpj) =>
  axios.get(`https://minhareceita.org/${cnpj}`);

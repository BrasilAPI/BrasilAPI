import axios from 'axios';

export const getCnpjData = async (cnpj) =>
  await axios.get(`https://minhareceita.org/${cnpj}`);

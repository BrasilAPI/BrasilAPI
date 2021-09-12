import axios from 'axios';

export const getCnpjData = (cnpj) =>
  axios.get(`${process.env.MINHA_RECEITA_BASE_URL}/${cnpj}`);

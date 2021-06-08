import axios from 'axios';

export const getCnpjData = async (cnpj) => {
  const url = 'https://minhareceita.org/';
  const response = await axios.get(`${url}/${cnpj}`);
  return response;
};

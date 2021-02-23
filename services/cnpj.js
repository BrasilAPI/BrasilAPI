import axios from 'axios';

export const getCnpjData = async (cnpj) => {
  const url = 'https://minhareceita.org/';
  const response = await axios({ url, method: 'post', data: `cnpj=${cnpj}` });
  return response;
};

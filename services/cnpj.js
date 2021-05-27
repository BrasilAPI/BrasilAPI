import axios from 'axios';

export const getCnpjData = async (cnpj) => {
  const response = await axios.get(`https://minhareceita.org/${cnpj}`);
  return response;
};

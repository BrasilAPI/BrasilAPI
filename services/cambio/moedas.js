import axios from 'axios';

const URL_CURRENCY =
  'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$format=json';

export const getCurrency = async () => {
  const { data } = await axios.get(URL_CURRENCY);

  return data.value;
};

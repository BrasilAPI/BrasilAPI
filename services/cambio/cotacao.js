import axios from 'axios';

const URL_EXCHANGE =
  "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='#dataCotacao'&$top=100&$format=json";

export const getDollarExchange = async (query) => {
  const { dataCotacao } = query;
  const url = URL_EXCHANGE.replace('#dataCotacao', dataCotacao);
  const { data } = await axios.get(url);

  return data.value;
};

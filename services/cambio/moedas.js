const axios = require('axios');

export const getCurrency = async () => {
  const resp = await axios.get(
    'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$format=json'
  );

  return new Map(
    resp.data.value.map((currency) => [
      currency.simbolo,
      {
        simbolo: currency.simbolo,
        nome: currency.nomeFormatado,
        tipo_moeda: currency.tipoMoeda,
      },
    ])
  );
};

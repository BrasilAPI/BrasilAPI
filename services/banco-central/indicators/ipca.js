import axios from 'axios';

const fetchIPCAByInterval = async ({ startDate, endDate }) => {
  const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.16121/dados?formato=json&dataInicial=${startDate}&dataFinal=${endDate}`;

  const { data: body } = await axios.get(url);

  return body;
};

const fetchHistoricalIPCA = async () => {
  const url =
    'http://api.bcb.gov.br/dados/serie/bcdata.sgs.16121/dados?formato=json';

  const { data: body } = await axios.get(url);

  return body;
};

const fetchLastIPCAValues = async (numberOfValues) => {
  const url = `http://api.bcb.gov.br/dados/serie/bcdata.sgs.16121/dados/ultimos/${numberOfValues}?formato=json`;

  const { data: body } = await axios.get(url);

  return body;
};

export { fetchIPCAByInterval, fetchHistoricalIPCA, fetchLastIPCAValues };

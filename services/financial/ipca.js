import axios from 'axios';

const getData = async (last) => {
  const url = `http://api.bcb.gov.br/dados/serie/bcdata.sgs.16121/dados${
    last === true ? '/ultimos/1' : ''
  }?formato=json`;

  const { data: body } = await axios.get(url);

  return body;
};

export const historicalIpca = async () => {
  try {
    return await getData(false);
  } catch (e) {
    return e.message;
  }
};

export const lastIpca = async () => {
  try {
    const data = await getData(true);
    return data[0];
  } catch (e) {
    return e.message;
  }
};

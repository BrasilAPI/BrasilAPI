import axios from 'axios';
import ncmList from './ncmList.json';

function parseObject(obj) {
  const formatDate = (date) => {
    const newDate = new Date(date.split('/').reverse());
    return newDate.toISOString().slice(0, 10);
  };

  const newObj = Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v])
  );
  newObj.data_fim = formatDate(newObj.data_fim);
  newObj.data_inicio = formatDate(newObj.data_inicio);
  return newObj;
}

const fetchNcmListFromSefaz = async () => {
  const url =
    'https://portalunico.siscomex.gov.br/classif/api/publico/nomenclatura/download/json';

  const { data: body } = await axios.get(url);

  return body;
};

export const getNcmData = async () => {
  try {
    const response = await fetchNcmListFromSefaz();
    return response.Nomenclaturas.map((el) => {
      return parseObject(el);
    });
  } catch (err) {
    return ncmList.Nomenclaturas.map((el) => {
      return parseObject(el);
    });
  }
};

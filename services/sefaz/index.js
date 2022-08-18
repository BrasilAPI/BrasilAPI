import axios from 'axios';
import ncmList from './ncmList.json';

const fetchNcmListFromSefaz = async () => {
  const url =
    'https://portalunico.siscomex.gov.br/classif/api/publico/nomenclatura/download/json';

  const { data: body } = await axios.get(url);

  return body;
};

export const getNcmData = async () => {
  try {
    const response = await fetchNcmListFromSefaz();
    return response.Nomenclaturas;
  } catch (err) {
    return ncmList.Nomenclaturas;
  }
};

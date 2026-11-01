import axios from 'axios';

const URL_UF = 'http://educacao.dadosabertosbr.org/api/cidades';

export const DADOS_ABERTOS_TIMEOUT_MS = 4000;

export const getCities = async (uf) => {
  const { data } = await axios.get(`${URL_UF}/${uf}`, {
    timeout: DADOS_ABERTOS_TIMEOUT_MS,
  });

  return data.map((item) => {
    const [ibgeCode, name] = item.split(':');
    return { nome: name, codigo_ibge: ibgeCode };
  });
};

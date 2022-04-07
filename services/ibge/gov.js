import axios from 'axios';

const URL_UF = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

export const getUfs = () => axios.get(URL_UF);
export const getUfByCode = (code) => axios.get(`${URL_UF}/${code}`);

export const getContiesByUf = async (uf) => {
  const { data } = await axios.get(`${URL_UF}/${uf}/municipios`);

  return data.map((item) => ({
    nome: item.nome,
    codigo_ibge: `${item.id}`,
  }));
};

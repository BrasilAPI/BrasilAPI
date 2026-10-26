import httpClient from '@/lib/http/client';

const URL_UF = 'http://educacao.dadosabertosbr.com/api/cidades';

export const getCities = async (uf) => {
  const { data } = await httpClient.get(`${URL_UF}/${uf}`);

  return data.map((item) => {
    const [ibgeCode, name] = item.split(':');
    return { nome: name, codigo_ibge: ibgeCode };
  });
};

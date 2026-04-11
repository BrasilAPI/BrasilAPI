import axios from 'axios';

const URL_UF = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

const UF_CAPITAIS = {
  AC: 'Rio Branco',
  AL: 'Maceió',
  AP: 'Macapá',
  AM: 'Manaus',
  BA: 'Salvador',
  CE: 'Fortaleza',
  DF: 'Brasília',
  ES: 'Vitória',
  GO: 'Goiânia',
  MA: 'São Luís',
  MT: 'Cuiabá',
  MS: 'Campo Grande',
  MG: 'Belo Horizonte',
  PA: 'Belém',
  PB: 'João Pessoa',
  PR: 'Curitiba',
  PE: 'Recife',
  PI: 'Teresina',
  RJ: 'Rio de Janeiro',
  RN: 'Natal',
  RS: 'Porto Alegre',
  RO: 'Porto Velho',
  RR: 'Boa Vista',
  SC: 'Florianópolis',
  SP: 'São Paulo',
  SE: 'Aracaju',
  TO: 'Palmas',
};

const addCapital = (uf) => ({
  ...uf,
  capital: UF_CAPITAIS[uf.sigla] ?? null,
});

export const getUfs = () =>
  axios.get(URL_UF).then((response) => {
    response.data = response.data.map(addCapital);
    return response;
  });

export const getUfByCode = (code) =>
  axios.get(`${URL_UF}/${code}`).then((response) => {
    response.data = addCapital(response.data);
    return response;
  });

export const getContiesByUf = async (uf) => {
  const { data } = await axios.get(`${URL_UF}/${uf}/municipios`);

  return data.map((item) => ({
    nome: item.nome,
    codigo_ibge: `${item.id}`,
  }));
};

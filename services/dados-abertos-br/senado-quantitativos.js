import axios from 'axios';

export const getDadosQuantitativos = async () => {
  const data = await axios.get(
    'https://adm.senado.gov.br/adm-dadosabertos/api/v1/servidores/quantitativos/cargos-funcoes'
  );
  return data;
};

export const getDadosQuantitativoPessoal = async () => {
  const data = await axios.get(
    'https://adm.senado.gov.br/adm-dadosabertos/api/v1/servidores/quantitativos/pessoal'
  );
  return data;
};

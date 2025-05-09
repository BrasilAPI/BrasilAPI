import { CODIGOS_ESTADOS } from '@/services/ibge/wikipedia';
import { getUfByCode } from '@/services/ibge/gov';
import NotFoundError from '@/errors/NotFoundError';
import BaseError from '@/errors/BaseError';
import axios from 'axios';

async function getPopulationFallback() {
  return "População não disponível no momento";
}

async function fetchPopulation(url) {
  try {
    return await axios.get(url);
  } catch (error) {
    throw error;
  }
}

export default async function handler(req, res) {
  const { sigla_ou_codigo } = req.query;

  try {
    if (!sigla_ou_codigo || !CODIGOS_ESTADOS[sigla_ou_codigo.toUpperCase()]) {
      throw new NotFoundError({
        message: 'Estado inválido ou não encontrado.',
        name: 'EstadoNotFoundException',
      });
    }

    const response = await getUfByCode(sigla_ou_codigo.toUpperCase());

    if (response.status !== 200) {
      throw new Error("Erro na requisição à API do IBGE");
    }

    const estado = response.data;
    const idEstado = estado.id;

    let populacao;
    try {
      const populacaoResponse = await fetchPopulation(`https://servicodados.ibge.gov.br/api/v2/censos/2020/estados/${idEstado}`);
      populacao = populacaoResponse.data.populacao || "Não disponível";
    } catch (err) {
      populacao = await getPopulationFallback();
    }

    const metadadosResponse = await axios.get(`https://servicodados.ibge.gov.br/api/v4/malhas/estados/${idEstado}/metadados`);
    if (metadadosResponse.status !== 200) {
      throw new Error("Erro ao buscar metadados do estado");
    }

    const metadados = metadadosResponse.data[0];

    const estadoDetalhado = {
      sigla: estado.sigla,
      nome: estado.nome,
      regiao: estado.regiao ? estado.regiao.nome : "Não disponível",
      ibge_codigo: estado.id,
      populacao: populacao,
      area: metadados.area.dimensao || "Não disponível",
    };

    return res.status(200).json(estadoDetalhado);

  } catch (err) {
    if (err instanceof BaseError) {
      return res.status(404).json({ error: err.message });
    }

    return res.status(500).json({ error: 'Erro ao buscar estado.' });
  }
}

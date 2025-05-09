import { CODIGOS_ESTADOS } from '@/services/ibge/wikipedia';
import { getUfByCode } from '@/services/ibge/gov';
import NotFoundError from '@/errors/NotFoundError';
import BaseError from '@/errors/BaseError';
import axios from 'axios';

export default async function handler(req, res) {
  const { siglaOuCodigo } = req.query;

  try {
    // console.log('Sigla ou Código recebido:', siglaOuCodigo);

    if (!siglaOuCodigo || !CODIGOS_ESTADOS[siglaOuCodigo.toUpperCase()]) {
      throw new NotFoundError({
        message: 'Estado inválido ou não encontrado.',
        name: 'EstadoNotFoundException',
      });
    }

    const response = await getUfByCode(siglaOuCodigo.toUpperCase());

    console.log(
      'Resposta da API IBGE (getUfByCode):',
      response.status,
      response.data
    );

    if (response.status !== 200 || !response.data) {
      throw new Error('Erro na requisição à API do IBGE');
    }

    const estado = response.data;
    const idEstado = estado.id;

    const metadadosResponse = await axios.get(
      `https://servicodados.ibge.gov.br/api/v4/malhas/estados/${idEstado}/metadados`
    );

    console.log(
      'Resposta da API IBGE (metadados):',
      metadadosResponse.status,
      metadadosResponse.data
    );

    if (
      metadadosResponse.status !== 200 ||
      !Array.isArray(metadadosResponse.data)
    ) {
      throw new Error('Metadados do estado não encontrados');
    }

    const metadados = metadadosResponse.data[0];
    const estadoDetalhado = {
      sigla: estado.sigla,
      nome: estado.nome,
      regiao: estado.regiao ? estado.regiao.nome : 'Não disponível',
      ibge_codigo: estado.id,
      area: metadados.area?.dimensao || 'Não disponível',
    };

    return res.status(200).json(estadoDetalhado);
  } catch (err) {
    console.error('Erro no handler:', err.message);
    if (err instanceof BaseError) {
      return res.status(404).json({ error: err.message });
    }
    return res
      .status(500)
      .json({ error: err.message || 'Erro ao buscar estado.' });
  }
}

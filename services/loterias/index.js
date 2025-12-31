import axios from 'axios';
import NotFoundError from '@/errors/NotFoundError';
import BadRequestError from '@/errors/BadRequestError';

const API_BASE_URL = 'https://servicebus2.caixa.gov.br/portaldeloterias/api';
const DEFAULT_TIMEOUT = 10000;

// Mapeamento de nomes de loterias para códigos da API da Caixa
const LOTERIAS_MAP = {
  megasena: 'megasena',
  quina: 'quina',
  lotofacil: 'lotofacil',
  lotomania: 'lotomania',
  timemania: 'timemania',
  duplasena: 'duplasena',
  federal: 'federal',
  diadesorte: 'diadesorte',
  supersete: 'supersete',
};

/**
 * Formata o resultado da API para o formato padrão
 * @param {Object} data - Dados da API
 * @returns {Object}
 */
function formatResultado(data) {
  // Retorna os dados da API mantendo a estrutura original
  // A API da Caixa já retorna os dados em um formato adequado
  return data;
}

/**
 * Valida se o tipo de loteria é suportado
 * @param {string} loteria - Nome da loteria
 * @returns {boolean}
 */
function isValidLoteria(loteria) {
  return Object.keys(LOTERIAS_MAP).includes(loteria.toLowerCase());
}

/**
 * Busca o último resultado de uma loteria
 * @param {string} loteria - Nome da loteria
 * @returns {Promise<Object>}
 */
export async function getUltimoResultado(loteria) {
  const loteriaLower = loteria.toLowerCase();

  if (!isValidLoteria(loteriaLower)) {
    throw new BadRequestError({
      message: `Tipo de loteria inválido. Tipos disponíveis: ${Object.keys(
        LOTERIAS_MAP
      ).join(', ')}`,
      type: 'loteria_error',
      name: 'INVALID_LOTERIA_TYPE',
    });
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}/${LOTERIAS_MAP[loteriaLower]}`,
      {
        timeout: DEFAULT_TIMEOUT,
      }
    );

    if (!response.data || !response.data.numero) {
      throw new NotFoundError({
        message: 'Resultado não encontrado',
        type: 'loteria_error',
        name: 'RESULT_NOT_FOUND',
      });
    }

    return formatResultado(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new NotFoundError({
        message: 'Resultado não encontrado',
        type: 'loteria_error',
        name: 'RESULT_NOT_FOUND',
      });
    }

    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }

    throw new Error(`Erro ao buscar resultado: ${error.message}`);
  }
}

/**
 * Busca resultado de um concurso específico
 * @param {string} loteria - Nome da loteria
 * @param {string|number} concurso - Número do concurso
 * @returns {Promise<Object>}
 */
export async function getResultadoPorConcurso(loteria, concurso) {
  const loteriaLower = loteria.toLowerCase();

  if (!isValidLoteria(loteriaLower)) {
    throw new BadRequestError({
      message: `Tipo de loteria inválido. Tipos disponíveis: ${Object.keys(
        LOTERIAS_MAP
      ).join(', ')}`,
      type: 'loteria_error',
      name: 'INVALID_LOTERIA_TYPE',
    });
  }

  const numeroConcurso = Number(concurso);

  if (
    !numeroConcurso ||
    numeroConcurso <= 0 ||
    !Number.isInteger(numeroConcurso)
  ) {
    throw new BadRequestError({
      message: 'Número do concurso deve ser um número inteiro positivo',
      type: 'loteria_error',
      name: 'INVALID_CONCURSO_NUMBER',
    });
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}/${LOTERIAS_MAP[loteriaLower]}/${numeroConcurso}`,
      {
        timeout: DEFAULT_TIMEOUT,
      }
    );

    if (!response.data || !response.data.numero) {
      throw new NotFoundError({
        message: `Concurso ${numeroConcurso} não encontrado para a loteria ${loteria}`,
        type: 'loteria_error',
        name: 'CONCURSO_NOT_FOUND',
      });
    }

    return formatResultado(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new NotFoundError({
        message: `Concurso ${numeroConcurso} não encontrado para a loteria ${loteria}`,
        type: 'loteria_error',
        name: 'CONCURSO_NOT_FOUND',
      });
    }

    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }

    throw new Error(`Erro ao buscar resultado: ${error.message}`);
  }
}

/**
 * Função auxiliar para buscar resultado de um concurso sem lançar erro
 * @param {number} numeroConcurso - Número do concurso
 * @returns {Promise<Object|null>}
 */
async function buscarConcursoSemErro(numeroConcurso) {
  try {
    return await getResultadoPorConcurso('megasena', numeroConcurso);
  } catch {
    return null;
  }
}

/**
 * Busca a Mega da Virada de um ano específico
 * A Mega da Virada é o concurso da Mega-Sena sorteado em 31 de dezembro
 * @param {number} ano - Ano para buscar a Mega da Virada
 * @returns {Promise<Object>}
 */
export async function getMegaDaVirada(ano) {
  const anoNumero = Number(ano);

  if (
    !ano ||
    !Number.isInteger(anoNumero) ||
    anoNumero < 1996 ||
    anoNumero > new Date().getFullYear() + 1
  ) {
    throw new BadRequestError({
      message: 'Ano inválido. Informe um ano válido a partir de 1996.',
      type: 'loteria_error',
      name: 'INVALID_YEAR',
    });
  }

  try {
    // A Mega da Virada é sempre sorteada em 31/12
    // Primeiro, tentamos buscar o último resultado
    const ultimoResultado = await getUltimoResultado('megasena');

    // Verifica se a data de apuração é 31/12 do ano informado
    if (ultimoResultado.dataApuracao) {
      const [dia, mes, anoApuracao] = ultimoResultado.dataApuracao.split('/');
      if (mes === '12' && dia === '31' && Number(anoApuracao) === anoNumero) {
        return ultimoResultado;
      }
    }

    // Se não for o último, tentamos buscar concursos próximos ao final do ano
    // Estimamos que a Mega da Virada está próxima ao último concurso do ano
    // A Mega-Sena tem aproximadamente 2 sorteios por semana, então cerca de 104 por ano
    // Começamos procurando a partir do último concurso e retrocedemos
    let numeroConcurso = ultimoResultado.numero;
    const limite = 150; // Limite de tentativas (cobre mais de 1 ano de concursos)
    let tentativas = 0;

    while (tentativas < limite && numeroConcurso > 0) {
      // eslint-disable-next-line no-await-in-loop
      const resultado = await buscarConcursoSemErro(numeroConcurso);

      if (resultado && resultado.dataApuracao) {
        const [dia, mes, anoApuracao] = resultado.dataApuracao.split('/');
        const anoApuracaoNum = Number(anoApuracao);

        // Se encontrou a Mega da Virada do ano buscado
        if (mes === '12' && dia === '31' && anoApuracaoNum === anoNumero) {
          return resultado;
        }

        // Se o ano da apuração for menor que o ano buscado, não vamos encontrar
        if (anoApuracaoNum < anoNumero) {
          break;
        }

        // Se já passou muito do ano buscado, pode pular mais concursos
        if (anoApuracaoNum > anoNumero + 1) {
          numeroConcurso -= 50; // Pula mais concursos se estiver muito à frente
          tentativas += 10;
        } else {
          numeroConcurso -= 1;
          tentativas += 1;
        }
      } else {
        numeroConcurso -= 1;
        tentativas += 1;
      }
    }

    throw new NotFoundError({
      message: `Mega da Virada de ${ano} não encontrada`,
      type: 'loteria_error',
      name: 'MEGA_DA_VIRADA_NOT_FOUND',
    });
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }

    throw new Error(`Erro ao buscar Mega da Virada: ${error.message}`);
  }
}

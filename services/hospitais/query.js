import BadRequestError from '@/errors/BadRequestError';
import { resolverAtendimento, VERTICAIS } from './index';
import {
  HABILITACOES,
  normalizarSoro,
  resolverHabilitacao,
  SOROS,
} from './vocabulario';

export const LIMIT_MAXIMO = 500;
export const LIMIT_PADRAO = 100;

const listar = (objeto) => Object.keys(objeto).join(', ');

// Cada um dos três parâmetros de busca resolve contra o vocabulário e falha
// alto quando o termo é desconhecido — devolver lista vazia esconderia um erro
// de digitação atrás de "nenhum hospital encontrado".
function resolverOuFalhar(valor, resolver, mensagemDeAjuda) {
  const resolvido = resolver(valor);

  if (!resolvido) {
    throw new BadRequestError({
      message: `Valor não reconhecido: '${valor}'. ${mensagemDeAjuda} Consulte /api/hospitais/v1/opcoes para a lista completa.`,
      type: 'validation_error',
    });
  }

  return resolvido;
}

export function parseAtendimentos({ atendimento, tratamento, habilitacao }) {
  const resolvidos = [];

  if (atendimento !== undefined) {
    resolvidos.push(
      resolverOuFalhar(
        atendimento,
        resolverAtendimento,
        'Aceita soros antiveneno, habilitações de oncologia e doenças raras, ou um código de portaria (ex: 17.07).'
      )
    );
  }

  if (tratamento !== undefined) {
    resolvidos.push({
      tipo: 'soro',
      soro: resolverOuFalhar(
        tratamento,
        normalizarSoro,
        `Soros aceitos: ${listar(SOROS)}.`
      ),
    });
  }

  if (habilitacao !== undefined) {
    resolvidos.push({
      tipo: 'habilitacao',
      ...resolverOuFalhar(
        habilitacao,
        resolverHabilitacao,
        `Habilitações aceitas: ${listar(
          HABILITACOES.oncologia.itens
        )}, ${listar(HABILITACOES.raras.itens)}.`
      ),
    });
  }

  return resolvidos;
}

export function parseVertical(vertical) {
  if (vertical === undefined) {
    return undefined;
  }

  const chave = String(vertical).toLowerCase();

  if (!VERTICAIS[chave]) {
    throw new BadRequestError({
      message: `Vertical inválida. Valores aceitos: ${Object.keys(
        VERTICAIS
      ).join(', ')}.`,
      type: 'validation_error',
    });
  }

  return chave;
}

export function parseUf(uf) {
  if (uf === undefined) {
    return undefined;
  }

  const sigla = String(uf).toUpperCase();

  if (!/^[A-Z]{2}$/.test(sigla)) {
    throw new BadRequestError({
      message: 'UF inválida. Informe a sigla do estado (ex: SP).',
      type: 'validation_error',
    });
  }

  return sigla;
}

function parseInteiro(valor, nome, { minimo }) {
  const numero = Number(valor);

  if (!Number.isInteger(numero) || numero < minimo) {
    throw new BadRequestError({
      message: `O parâmetro ${nome} deve ser um número inteiro maior ou igual a ${minimo}.`,
      type: 'validation_error',
    });
  }

  return numero;
}

export function parsePaginacao({ limit, offset }, limitPadrao = LIMIT_PADRAO) {
  const limitInformado =
    limit === undefined
      ? limitPadrao
      : parseInteiro(limit, 'limit', { minimo: 1 });

  return {
    limit: Math.min(limitInformado, LIMIT_MAXIMO),
    offset:
      offset === undefined ? 0 : parseInteiro(offset, 'offset', { minimo: 0 }),
  };
}

export function parseCoordenada(valor, nome, limite) {
  const numero = Number(valor);

  if (!Number.isFinite(numero) || Math.abs(numero) > limite) {
    throw new BadRequestError({
      message: `O parâmetro ${nome} deve ser um número entre -${limite} e ${limite}.`,
      type: 'validation_error',
    });
  }

  return numero;
}

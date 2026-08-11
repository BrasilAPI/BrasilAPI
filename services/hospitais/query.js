import BadRequestError from '@/errors/BadRequestError';
import { resolverAtendimento, VERTICAIS } from './index';

export const LIMIT_MAXIMO = 500;
export const LIMIT_PADRAO = 100;

// Um só parâmetro de busca por atendimento. Ter também `tratamento` e
// `habilitacao` era redundante: os três resolviam contra o mesmo vocabulário e
// devolviam resultados idênticos, só triplicando o que o usuário precisa
// decidir antes de fazer a primeira chamada.
export function parseAtendimento(valor) {
  if (valor === undefined) {
    return undefined;
  }

  const resolvido = resolverAtendimento(valor);

  // Devolver lista vazia esconderia um erro de digitação atrás de "nenhum
  // hospital encontrado" — num endpoint de saúde isso é pior que um 400.
  if (!resolvido) {
    throw new BadRequestError({
      message: `Atendimento não reconhecido: '${valor}'. Aceita soros antiveneno (ex: cascavel), habilitações de oncologia e doenças raras (ex: radioterapia) ou um código de portaria (ex: 17.07). Consulte /api/hospitais/v1/opcoes para a lista completa.`,
      type: 'validation_error',
    });
  }

  return resolvido;
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

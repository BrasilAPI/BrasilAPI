import BadRequestError from '@/errors/BadRequestError';
import { resolverAtendimento, VERTICAIS } from './vocabulario';

const LIMIT_MAXIMO = 500;
const LIMIT_PADRAO = 100;
const RAIO_KM_PADRAO = 50;
const RAIO_KM_MAXIMO = 200;

export const METROS_POR_KM = 1000;

const invalido = (message) =>
  new BadRequestError({ message, type: 'validation_error' });

export function parseAtendimento(valor) {
  if (valor === undefined) {
    return undefined;
  }

  const resolvido = resolverAtendimento(valor);

  // Devolver lista vazia esconderia um erro de digitação atrás de "nenhum
  // hospital encontrado" — num endpoint de saúde isso é pior que um 400.
  if (!resolvido) {
    throw invalido(
      `Atendimento não reconhecido: '${valor}'. Aceita soros antiveneno (ex: cascavel), habilitações de oncologia e doenças raras (ex: radioterapia) ou um código de portaria (ex: 17.07). Consulte /api/hospitais/v1/opcoes para a lista completa.`
    );
  }

  return resolvido;
}

export function parseVertical(vertical) {
  if (vertical === undefined) {
    return undefined;
  }

  const chave = String(vertical).toLowerCase();

  if (!VERTICAIS[chave]) {
    throw invalido(
      `Vertical inválida. Valores aceitos: ${Object.keys(VERTICAIS).join(
        ', '
      )}.`
    );
  }

  return chave;
}

export function parseUf(uf) {
  if (uf === undefined) {
    return undefined;
  }

  const sigla = String(uf).toUpperCase();

  if (!/^[A-Z]{2}$/.test(sigla)) {
    throw invalido('UF inválida. Informe a sigla do estado (ex: SP).');
  }

  return sigla;
}

function parseInteiro(valor, nome, minimo) {
  const numero = Number(valor);

  if (!Number.isInteger(numero) || numero < minimo) {
    throw invalido(
      `O parâmetro ${nome} deve ser um número inteiro maior ou igual a ${minimo}.`
    );
  }

  return numero;
}

function parsePaginacao({ limit, offset }, limitPadrao) {
  const limitInformado =
    limit === undefined ? limitPadrao : parseInteiro(limit, 'limit', 1);

  return {
    limit: Math.min(limitInformado, LIMIT_MAXIMO),
    offset: offset === undefined ? 0 : parseInteiro(offset, 'offset', 0),
  };
}

// Valida a paginação da query e fatia a lista, devolvendo o envelope que as
// rotas de busca compartilham. Manter o fatiamento num só lugar impede que as
// rotas divirjam no contrato de paginação.
export function paginar(lista, query, limitPadrao = LIMIT_PADRAO) {
  const { limit, offset } = parsePaginacao(query, limitPadrao);

  return {
    total: lista.length,
    limit,
    offset,
    items: lista.slice(offset, offset + limit),
  };
}

function parseCoordenada(valor, nome, limite) {
  const numero = Number(valor);

  if (!Number.isFinite(numero) || Math.abs(numero) > limite) {
    throw invalido(
      `O parâmetro ${nome} deve ser um número entre -${limite} e ${limite}.`
    );
  }

  return numero;
}

export const parseLatitude = (valor) => parseCoordenada(valor, 'latitude', 90);
export const parseLongitude = (valor) =>
  parseCoordenada(valor, 'longitude', 180);

export function parseRaioEmMetros(raioKm) {
  if (raioKm === undefined) {
    return RAIO_KM_PADRAO * METROS_POR_KM;
  }

  const numero = Number(raioKm);

  if (!Number.isFinite(numero) || numero <= 0 || numero > RAIO_KM_MAXIMO) {
    throw invalido(
      `O parâmetro raio_km deve ser um número entre 0 e ${RAIO_KM_MAXIMO}.`
    );
  }

  return numero * METROS_POR_KM;
}

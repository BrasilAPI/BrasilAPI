import NotFoundError from '@/errors/NotFoundError';

const UF_CODE_MAPPER = {
  RO: 11,
  AC: 12,
  AM: 13,
  RR: 14,
  PA: 15,
  AP: 16,
  TO: 17,
  MA: 21,
  PI: 22,
  CE: 23,
  RN: 24,
  PB: 25,
  PE: 26,
  AL: 27,
  SE: 28,
  BA: 29,
  MG: 31,
  ES: 32,
  RJ: 33,
  SP: 35,
  PR: 41,
  SC: 42,
  RS: 43,
  MS: 50,
  MT: 51,
  GO: 52,
  DF: 53,
};

const VALID_UF_CODES = new Set(Object.values(UF_CODE_MAPPER));

/**
 * Map UF (e.g. SP) or IBGE numeric code (e.g. 35) to UF Code Id on IBGE API
 * @param {string} uf String UF short or numeric IBGE code
 * @returns {number} UF Code
 */
export default function mapUfToUfCode(uf) {
  if (VALID_UF_CODES.has(Number(uf))) {
    return Number(uf);
  }

  const ufCode = UF_CODE_MAPPER[uf.toUpperCase()];
  if (!ufCode) {
    throw new NotFoundError({ message: `UF ${uf} não encontrado` });
  }

  return ufCode;
}

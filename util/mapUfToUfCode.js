import NotFoundError from "@/errors/NotFoundError";

const UF_CODE_MAPPER = {
  "RO": 11,
  "AC": 12,
  "AM": 13,
  "RR": 14,
  "PA": 15,
  "AP": 16,
  "TO": 17,
  "MA": 21,
  "PI": 22,
  "CE": 23,
  "RN": 24,
  "PB": 25,
  "PE": 26,
  "AL": 27,
  "SE": 28,
  "BA": 29,
  "MG": 31,
  "ES": 32,
  "RJ": 33,
  "SP": 35,
  "PR": 41,
  "SC": 42,
  "RS": 43,
  "MS": 50,
  "MT": 51,
  "GO": 52,
  "DF": 53,
}

/**
 * Map UF (e.g. SP) to UF Code Id on IBGE API.
 * Aceita também o próprio código numérico do IBGE (e.g. 22) e o devolve inalterado.
 * @param {string|number} uf Sigla da UF ou código numérico do IBGE
 * @returns {number} UF Code
 */
export default function mapUfToUfCode(uf) {
    const input = String(uf).toUpperCase();

    if (/^\d+$/.test(input) && Object.values(UF_CODE_MAPPER).includes(Number(input))) {
        return Number(input);
    }

    const ufCode = UF_CODE_MAPPER[input];
    if(!ufCode){
        throw new NotFoundError(`UF ${uf} não encontrado`);
    }

    return ufCode;
}
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
 * Map UF (e.g. SP) to UF Code Id on IBGE API
 * @param {string} uf String UF short
 * @returns {number} UF Code
 */
export default function mapUfToUfCode(uf) {
    const ufCodes = Object.values(UF_CODE_MAPPER);
    const numericInput = Number(uf);
    if (Number.isInteger(numericInput) && ufCodes.includes(numericInput)) {
        return numericInput;
    }

    const ufCode = UF_CODE_MAPPER[uf.toUpperCase()];
    if(!ufCode){
        throw new NotFoundError({ message: `UF ${uf} não encontrada.` });
    }

    return ufCode;
}
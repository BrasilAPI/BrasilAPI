export const VEHICLE_TYPE = {
  CAR: 1,
  MOTORCYCLE: 2,
  TRUCK: 3,
};

export const FIPE_URL = process.env.FIPE_BASE_URL;
export const TABELA_REFERENCIA_URL = `${FIPE_URL}${process.env.FIPE_TABELA_REFERENCIA_ENDPOINT}`;
export const MODELO_ANO_URL = `${FIPE_URL}${process.env.FIPE_MODELO_ANO_ENDPOINT}`;
export const PRECO_URL = `${FIPE_URL}${process.env.FIPE_PRECO_ENDPOINT}`;
export const MARCAS_URL = `${FIPE_URL}${process.env.FIPE_MARCAS_ENDPOINT}`;

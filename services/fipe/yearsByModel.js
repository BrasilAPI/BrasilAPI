import { fipePost } from './http';
import { parallelumListAnos } from './parallelum';
import { VEHICLE_TYPE } from './constants';
import { getLatestReferenceTable } from './referenceTable';

async function listYearsByModel({
  vehicleType,
  makerCode,
  modelCode,
  referenceTable,
}) {
  const params = new URLSearchParams();
  params.append('codigoTabelaReferencia', referenceTable);
  params.append('codigoTipoVeiculo', vehicleType);
  params.append('codigoMarca', makerCode);
  params.append('codigoModelo', modelCode);

  const { data } = await fipePost('/veiculos/ConsultarAnoModelo', params, () =>
    parallelumListAnos(vehicleType, makerCode, modelCode)
  );

  if (!Array.isArray(data)) {
    throw new Error('Parâmetros inválidos');
  }

  return data.map((item) => ({
    nome: item.Label,
    valor: item.Value,
  }));
}

export async function listYearsByModelAndType({
  vehicleType,
  makerCode,
  modelCode,
  referenceTable,
}) {
  const referenceTableCode =
    referenceTable || (await getLatestReferenceTable());

  return listYearsByModel({
    vehicleType,
    makerCode,
    modelCode,
    referenceTable: referenceTableCode,
  });
}

// Compatibility functions for legacy positional arguments
export const listCarYearsByModel = (makerCode, modelCode, referenceTable) =>
  listYearsByModelAndType({
    makerCode,
    modelCode,
    referenceTable,
    vehicleType: VEHICLE_TYPE.CAR,
  });

export const listMotorcycleYearsByModel = (
  makerCode,
  modelCode,
  referenceTable
) =>
  listYearsByModelAndType({
    makerCode,
    modelCode,
    referenceTable,
    vehicleType: VEHICLE_TYPE.MOTORCYCLE,
  });

export const listTruckYearsByModel = (makerCode, modelCode, referenceTable) =>
  listYearsByModelAndType({
    makerCode,
    modelCode,
    referenceTable,
    vehicleType: VEHICLE_TYPE.TRUCK,
  });

import { VEHICLE_TYPE } from './constants';
import { getLatestReferenceTable } from './referenceTable';
import { fipePost } from './http';

async function listAutomakers({ vehicleType, referenceTable }) {
  const params = new URLSearchParams();
  params.append('codigoTabelaReferencia', referenceTable);
  params.append('codigoTipoVeiculo', vehicleType);

  const { data } = await fipePost('/veiculos/ConsultarMarcas', params);

  return data
    .map((item) => ({ nome: item.Label, valor: item.Value }))
    .sort((a, b) => parseInt(a.valor, 10) - parseInt(b.valor, 10));
}

export async function listCarAutomakers(
  { referenceTable } = { referenceTable: undefined }
) {
  const referenceTableCode =
    referenceTable || (await getLatestReferenceTable());

  return listAutomakers({
    vehicleType: VEHICLE_TYPE.CAR,
    referenceTable: referenceTableCode,
  });
}

export async function listMotorcycleAutomakers(
  { referenceTable } = { referenceTable: undefined }
) {
  const referenceTableCode =
    referenceTable || (await getLatestReferenceTable());

  return listAutomakers({
    vehicleType: VEHICLE_TYPE.MOTORCYCLE,
    referenceTable: referenceTableCode,
  });
}

export async function listTruckAutomakers(
  { referenceTable } = { referenceTable: undefined }
) {
  const referenceTableCode =
    referenceTable || (await getLatestReferenceTable());

  return listAutomakers({
    vehicleType: VEHICLE_TYPE.TRUCK,
    referenceTable: referenceTableCode,
  });
}

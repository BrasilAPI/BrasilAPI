import axios from 'axios';

import { FIPE_URL, VEHICLE_TYPE } from './constants';

async function listByModel({
  vehicleType,
  referenceTable,
  makerCode,
  modelCode,
}) {
  const params = new URLSearchParams();
  params.append('codigoTabelaReferencia', referenceTable);
  params.append('codigoTipoVeiculo', vehicleType);
  params.append('codigoMarca', makerCode);
  params.append('codigoModelo', modelCode);

  const { data } = await axios.post(
    `${FIPE_URL}/veiculos/ConsultarAnoModelo`,
    params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  if (!Array.isArray(data)) {
    throw new Error('Parâmetros inválidos');
  }

  return data.map((item) => ({
    nome: item.Label,
    valor: String(item.Value),
  }));
}

export async function listCarYearsByModel(
  makerCode,
  modelCode,
  referenceTableCode
) {
  return listByModel({
    vehicleType: VEHICLE_TYPE.CAR,
    referenceTable: referenceTableCode,
    makerCode,
    modelCode,
  });
}

export async function listMotorcycleYearsByModel(
  makerCode,
  modelCode,
  referenceTableCode
) {
  return listByModel({
    vehicleType: VEHICLE_TYPE.MOTORCYCLE,
    referenceTable: referenceTableCode,
    makerCode,
    modelCode,
  });
}

export async function listTruckYearsByModel(
  makerCode,
  modelCode,
  referenceTableCode
) {
  return listByModel({
    vehicleType: VEHICLE_TYPE.TRUCK,
    referenceTable: referenceTableCode,
    makerCode,
    modelCode,
  });
}

import { VEHICLE_TYPE } from './constants';
import { fipePost } from './http';

async function listByMaker({ vehicleType, referenceTable, makerCode }) {
  const params = new URLSearchParams();
  params.append('codigoTabelaReferencia', referenceTable);
  params.append('codigoTipoVeiculo', vehicleType);
  params.append('codigoMarca', makerCode);

  const { data } = await fipePost('/veiculos/ConsultarModelos', params);

  return data.Modelos.map((item) => ({ modelo: item.Label }));
}

export async function listCarByMaker(makerCode, referenceTableCode) {
  return listByMaker({
    vehicleType: VEHICLE_TYPE.CAR,
    referenceTable: referenceTableCode,
    makerCode,
  });
}

export async function listMotorcycleByMaker(makerCode, referenceTableCode) {
  return listByMaker({
    vehicleType: VEHICLE_TYPE.MOTORCYCLE,
    referenceTable: referenceTableCode,
    makerCode,
  });
}

export async function listTruckByMaker(makerCode, referenceTableCode) {
  return listByMaker({
    vehicleType: VEHICLE_TYPE.TRUCK,
    referenceTable: referenceTableCode,
    makerCode,
  });
}

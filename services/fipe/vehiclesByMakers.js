import axios from 'axios';

import { FIPE_URL, VEHICLE_TYPE } from './constants';

async function listByMaker({ vehicleType, referenceTable, makerCode }) {
  const params = new URLSearchParams();
  params.append('codigoTabelaReferencia', referenceTable);
  params.append('codigoTipoVeiculo', vehicleType);
  params.append('codigoMarca', makerCode);

  const { data } = await axios.post(
    `${FIPE_URL}/veiculos/ConsultarModelos`,
    params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

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

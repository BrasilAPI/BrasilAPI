import axios from 'axios';

import { FIPE_URL, VEHICLE_TYPE } from './constants';
import { getLatestReferenceTable } from './referenceTable';

async function listAutomakers({ vehicleType, referenceTable }) {
  const params = new URLSearchParams();
  params.append('codigoTabelaReferencia', referenceTable);
  params.append('codigoTipoVeiculo', vehicleType);

  const { data } = await axios.post(
    `${FIPE_URL}/veiculos/ConsultarMarcas`,
    params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return data
    .map((item) => ({ nome: item.Label, valor: item.Value }))
    .sort((a, b) => parseInt(a.valor, 10) - parseInt(b.valor, 10));
}

export async function listCarAutomakers(referenceTable) {
  const referenceTableCode =
    referenceTable || (await getLatestReferenceTable());

  return listAutomakers({
    vehicleType: VEHICLE_TYPE.CAR,
    referenceTable: referenceTableCode,
  });
}

export async function listMotorcycleAutomakers(referenceTable) {
  const referenceTableCode =
    referenceTable || (await getLatestReferenceTable());

  return listAutomakers({
    vehicleType: VEHICLE_TYPE.MOTORCYCLE,
    referenceTable: referenceTableCode,
  });
}

export async function listTruckAutomakers(referenceTable) {
  const referenceTableCode =
    referenceTable || (await getLatestReferenceTable());

  return listAutomakers({
    vehicleType: VEHICLE_TYPE.TRUCK,
    referenceTable: referenceTableCode,
  });
}

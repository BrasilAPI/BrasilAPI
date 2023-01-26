import axios from 'axios';

import { FIPE_URL, VEHICLE_TYPE } from './constants';
import { getLatestReferenceTable } from './referenceTable';

async function listAutomakers({ vehicleType, referenceTable }) {
  referenceTable = referenceTable || await getLatestReferenceTable();
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

  return mapAndSortAutomakers(data);
}
const mapAndSortAutomakers = (data) => data
  .map((item) => ({ nome: item.Label, valor: item.Value }))
  .sort((a, b) => parseInt(a.valor, 10) - parseInt(b.valor, 10));

const getAutomakers = async (vehicleType, referenceTable) => {
  return listAutomakers({
    vehicleType,
    referenceTable,
  });
};

export const listCarAutomakers = (referenceTable) => getAutomakers(VEHICLE_TYPE.CAR, referenceTable);
export const listMotorcycleAutomakers = (referenceTable) => getAutomakers(VEHICLE_TYPE.MOTORCYCLE, referenceTable);
export const listTruckAutomakers = (referenceTable) => getAutomakers(VEHICLE_TYPE.TRUCK, referenceTable);


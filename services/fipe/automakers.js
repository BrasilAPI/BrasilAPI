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

  return mapAndSortAutomakers(data);
}

const mapAndSortAutomakers = (data) => data
  .map((item) => ({ nome: item.Label, valor: item.Value }))
  .sort((a, b) => parseInt(a.valor, 10) - parseInt(b.valor, 10));

const getAutomakers = async (vehicleType, referenceTable = await getLatestReferenceTable()) => listAutomakers({
  vehicleType,
  referenceTable,
});

export const listCarAutomakers = () => getAutomakers(VEHICLE_TYPE.CAR);
export const listMotorcycleAutomakers = () => getAutomakers(VEHICLE_TYPE.MOTORCYCLE);
export const listTruckAutomakers = () => getAutomakers(VEHICLE_TYPE.TRUCK);

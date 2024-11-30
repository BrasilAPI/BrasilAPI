import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';

import {
  listCarByMaker,
  listMotorcycleByMaker,
  listTruckByMaker,
} from '@/services/fipe/vehiclesByMakers';
import {
  listReferenceTables,
  getLatestReferenceTable,
} from '@/services/fipe/referenceTable';

const VEHICLE_TYPES = {
  caminhoes: listTruckByMaker,
  carros: listCarByMaker,
  motos: listMotorcycleByMaker,
};

async function FipeVehicles(request, response) {
  const { vehicleType, makerCode } = request.query;
  const referenceTableCode = request.query.tabela_referencia
    ? request.query.tabela_referencia
    : await getLatestReferenceTable();

  const referenceTable = referenceTableCode
    ? parseInt(referenceTableCode, 10)
    : undefined;

  if (referenceTableCode) {
    const referenceTables = await listReferenceTables();

    const hasReferenceTable = !!referenceTables.find(
      (table) => table.codigo === referenceTable
    );

    if (!hasReferenceTable) {
      throw new BadRequestError({ message: 'Tabela de referência inválida' });
    }
  } else {
    throw new BadRequestError({ message: 'Tabela de referência inválida' });
  }

  if (!Object.keys(VEHICLE_TYPES).includes(vehicleType))
    throw new BadRequestError({ message: 'Tipo de veículo inválido' });

  const listVehicles = VEHICLE_TYPES[vehicleType];

  const vehicles = await listVehicles(makerCode, referenceTable);
  return response.status(200).json(vehicles);
}

export default app({ cache: 86400 }).get(FipeVehicles);

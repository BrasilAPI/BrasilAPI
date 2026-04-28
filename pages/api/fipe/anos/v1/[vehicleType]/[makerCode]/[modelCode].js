import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';

import {
  listCarYearsByModel,
  listMotorcycleYearsByModel,
  listTruckYearsByModel,
} from '@/services/fipe/yearsByModel';
import {
  listReferenceTables,
  getLatestReferenceTable,
} from '@/services/fipe/referenceTable';

const VEHICLE_TYPES = {
  caminhoes: listTruckYearsByModel,
  carros: listCarYearsByModel,
  motos: listMotorcycleYearsByModel,
};

async function FipeModelYears(request, response) {
  const { vehicleType, makerCode, modelCode } = request.query;
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

  const listYears = VEHICLE_TYPES[vehicleType];

  try {
    const years = await listYears(makerCode, modelCode, referenceTable);
    return response.status(200).json(years);
  } catch (error) {
    if (error.message === 'Parâmetros inválidos') {
      throw new BadRequestError({ message: 'Parâmetros inválidos' });
    }
    throw error;
  }
}

export default app({ cache: 86400 }).get(FipeModelYears);

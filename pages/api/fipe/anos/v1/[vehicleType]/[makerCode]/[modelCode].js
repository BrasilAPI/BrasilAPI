import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import InternalError from '@/errors/InternalError';

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

async function FipeYears(request, response) {
  const { vehicleType, makerCode, modelCode } = request.query;

  try {
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

    const getYears = VEHICLE_TYPES[vehicleType];

    const years = await getYears(makerCode, modelCode, referenceTable);
    return response.status(200).json(years);
  } catch (error) {
    if (error instanceof BadRequestError) throw error;

    if (error.message === 'Parâmetros inválidos') {
      throw new BadRequestError({ message: 'Parâmetros inválidos' });
    }

    throw new InternalError({
      message: error.message || 'Erro interno ao consultar a tabela FIPE',
    });
  }
}

export default app({ cache: 86400 }).get(FipeYears);

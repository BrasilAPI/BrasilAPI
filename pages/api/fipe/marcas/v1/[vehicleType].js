import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';

//TODO

import {
  listTruckAutomakers,
  listCarAutomakers,
  listMotorcycleAutomakers,
} from '@/services/fipe/automakers';
import { listReferenceTables } from '@/services/fipe/referenceTable';

const VEHICLE_TYPES = {
  caminhoes: listTruckAutomakers,
  carros: listCarAutomakers,
  motos: listMotorcycleAutomakers,
};

async function FipeAutomakers(request, response) {
  const referenceTableCode = request.query.tabela_referencia;
  const { vehicleType } = request.query;

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
  }

  if (!Object.keys(VEHICLE_TYPES).includes(vehicleType)) {
    throw new BadRequestError({ message: 'Tipo de veículo inválido' });
  }

  const listAutomakers = VEHICLE_TYPES[vehicleType];

  const automakers = await listAutomakers({ referenceTable });
  return response.status(200).json(automakers);
}

export default app({ cache: 86400 }).get(FipeAutomakers);

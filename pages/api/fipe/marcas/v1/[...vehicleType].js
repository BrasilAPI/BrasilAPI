// pages/api/fipe/marcas/v1/[...vehicleType].js

import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';

import {
  listTruckAutomakers,
  listCarAutomakers,
  listMotorcycleAutomakers,
  listModels,
} from '@/services/fipe/automakers';
import { listReferenceTables } from '@/services/fipe/referenceTable';

const VEHICLE_TYPES = {
  caminhoes: listTruckAutomakers,
  carros: listCarAutomakers,
  motos: listMotorcycleAutomakers,
};

async function FipeAutomakers(request, response) {
  const referenceTableCode = request.query.tabela_referencia;
  const data = request.query.vehicleType;

  const vehicleType = data[0];
  const brand = data[1];

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

  if (brand) {
    const brandInfo = automakers.find((automaker) => automaker.nome === brand);

    if (!brandInfo) {
      throw new BadRequestError({ message: 'Marca inválida' });
    }

    const models = await listModels(brandInfo.valor);

    return response.status(200).json(models);
  }

  return response.status(200).json(automakers);
}

export default app({ cache: 86400 }).get(FipeAutomakers);

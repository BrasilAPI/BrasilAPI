import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';

import {
  listCarByMaker,
  listMotorcycleByMaker,
  listTruckByMaker,
} from '@/services/fipe/vehiclesByMakers';
import { getLatestReferenceTable } from '@/services/fipe/referenceTable';

const VEHICLE_TYPES = {
  caminhoes: listTruckByMaker,
  carros: listCarByMaker,
  motos: listMotorcycleByMaker,
};

async function FipeVehicles(request, response) {
  const makerCode = request.query.codigoMarca;
  const { vehicleType } = request.query;

  if (!Object.keys(VEHICLE_TYPES).includes(vehicleType))
    throw new BadRequestError({ message: 'Tipo de veículo inválido' });

  const listVehicles = VEHICLE_TYPES[vehicleType];

  const vehicles = await listVehicles(makerCode);
  return response.status(200).json(vehicles);
}

export default app({ cache: 86400 }).get(FipeVehicles);

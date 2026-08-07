import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import InternalError from '@/errors/InternalError';

import {
  getCarPriceByModelAndYear,
  getMotorcyclePriceByModelAndYear,
  getTruckPriceByModelAndYear,
} from '@/services/fipe/priceByModelAndYear';
import {
  listReferenceTables,
  getLatestReferenceTable,
} from '@/services/fipe/referenceTable';

const VEHICLE_TYPES = {
  caminhoes: getTruckPriceByModelAndYear,
  carros: getCarPriceByModelAndYear,
  motos: getMotorcyclePriceByModelAndYear,
};

async function FipeVehicleDetails(request, response) {
  const { vehicleType, makerCode, modelCode, yearCode } = request.query;

  try {
    const tabelaReferencia = request.query.tabela_referencia;

    const referenceTable = tabelaReferencia
      ? parseInt(tabelaReferencia, 10)
      : await getLatestReferenceTable();

    if (tabelaReferencia) {
      const referenceTables = await listReferenceTables();

      const hasReferenceTable = !!referenceTables.find(
        (table) => table.codigo === referenceTable
      );

      if (!hasReferenceTable) {
        throw new BadRequestError({ message: 'Tabela de referência inválida' });
      }
    }

    if (!Object.keys(VEHICLE_TYPES).includes(vehicleType))
      throw new BadRequestError({ message: 'Tipo de veículo inválido' });

    const getPrice = VEHICLE_TYPES[vehicleType];

    const details = await getPrice(
      makerCode,
      modelCode,
      yearCode,
      referenceTable
    );
    return response.status(200).json(details);
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

export default app({ cache: 86400 }).get(FipeVehicleDetails);

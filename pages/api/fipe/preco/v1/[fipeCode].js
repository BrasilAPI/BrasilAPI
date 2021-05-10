import app from '@/app';
import BadRequestError from '@/errors/bad-request';

import { getFipePrice } from '@/services/fipe/price';
import { listReferenceTables } from '@/services/fipe/referenceTable';

async function FipePrice(request, response) {
  try {
    const referenceTableCode = request.query.tabela_referencia;
    const { fipeCode } = request.query;

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

    const data = await getFipePrice({ referenceTable, fipeCode });
    return response.status(200).json(data);
  } catch (err) {
    if (err.message === 'Código fipe inválido') {
      throw new BadRequestError({ message: err.message });
    }

    throw err;
  }
}

export default app({ cache: 86400 }).get(FipePrice);

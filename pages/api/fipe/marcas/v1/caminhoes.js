import app from '@/app';
import BadRequestError from '@/errors/bad-request';

import { listReferenceTables, listTruckAutomakers } from '@/services/fipe';

async function FipeTruckAutomakers(request, response) {
  const referenceTableCode = request.query.tabela_referencia;
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

  const automakers = await listTruckAutomakers({ referenceTable });
  return response.status(200).json(automakers);
}

export default app({ cache: 86400 }).get(FipeTruckAutomakers);

import app from '@/app';
import BadRequestError from '@/errors/bad-request';

import {
  listTruckAutomakers,
  listCarAutomakers,
  listMotorcycleAutomakers,
  listReferenceTables,
} from '@/services/fipe/automakers';

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

  const automakers = (
    await Promise.all([
      listCarAutomakers({ referenceTable }),
      listTruckAutomakers({ referenceTable }),
      listMotorcycleAutomakers({ referenceTable }),
    ])
  )
    .reduce((array, item) => array.concat(...item), [])
    .sort((a, b) => parseInt(a.valor, 10) - parseInt(b.valor, 10));
  return response.status(200).json(automakers);
}

export default app({ cache: 86400 }).get(FipeTruckAutomakers);

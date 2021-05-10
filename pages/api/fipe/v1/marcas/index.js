import app from '@/app';

import {
  listTruckAutomakers,
  listCarAutomakers,
  listMotorcycleAutomakers,
} from '@/services/fipe';

async function FipeTruckAutomakers(request, response) {
  const referenceTable = request.query.tabela_referencia;

  const automakers = (
    await Promise.all([
      listCarAutomakers({ referenceTable }),
      listTruckAutomakers({ referenceTable }),
      listMotorcycleAutomakers({ referenceTable }),
    ])
  )
    .reduce((array, item) => array.concat(...item), [])
    .sort((a, b) => a.value - b.value);
  return response.status(200).json(automakers);
}

export default app({ cache: 86400 }).get(FipeTruckAutomakers);

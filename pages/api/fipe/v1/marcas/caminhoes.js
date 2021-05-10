import app from '@/app';

import { listTruckAutomakers } from '@/services/fipe';

async function FipeTruckAutomakers(request, response) {
  const referenceTable = request.query.tabela_referencia;
  const automakers = await listTruckAutomakers({ referenceTable });
  return response.status(200).json(automakers);
}

export default app({ cache: 86400 }).get(FipeTruckAutomakers);

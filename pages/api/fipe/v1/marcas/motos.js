import app from '@/app';

import { listMotorcycleAutomakers } from '@/services/fipe';

async function FipeMotorcycleAutomakers(request, response) {
  const referenceTable = request.query.tabela_referencia;
  const automakers = await listMotorcycleAutomakers({ referenceTable });
  return response.status(200).json(automakers);
}

export default app({ cache: 86400 }).get(FipeMotorcycleAutomakers);

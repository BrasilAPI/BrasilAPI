import app from '@/app';

import { listCarAutomakers } from '@/services/fipe';

async function FipeCarsAutomakers(request, response) {
  const referenceTable = request.query.tabela_referencia;
  const automakers = await listCarAutomakers({ referenceTable });
  return response.status(200).json(automakers);
}

export default app({ cache: 86400 }).get(FipeCarsAutomakers);

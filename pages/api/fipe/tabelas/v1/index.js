import app from '@/app';

import { listReferenceTables } from '@/services/fipe/referenceTable';

async function FipeReferenceTables(request, response) {
  const referenceTables = await listReferenceTables();

  return response.status(200).json(referenceTables);
}

export default app({ cache: 86400 }).get(FipeReferenceTables);

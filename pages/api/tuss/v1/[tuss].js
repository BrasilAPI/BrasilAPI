import app from '@/app';
import NotFoundError from '@/errors/NotFoundError';
import { findTussByCodeExact } from '@/services/tuss';

async function getTussDetail(request, response) {
  const { tuss } = request.query;
  const item = findTussByCodeExact(tuss);

  if (!item) {
    throw new NotFoundError({
      message: 'Código TUSS não encontrado',
      type: 'TUSS_CODE_NOT_FOUND',
    });
  }

  return response.status(200).json(item);
}

export default app().get(getTussDetail);

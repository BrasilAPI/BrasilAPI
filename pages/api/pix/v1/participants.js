import app from '@/app';
import { getPixParticipants } from '@/services/pix/participants';

/**
 * Cache de 21600s (6 horas): o snapshot de participantes é atualizado no
 * repositório em dias úteis, então não há motivo para cache curto.
 */
async function handler(request, response) {
  const participants = getPixParticipants();

  return response.status(200).json(participants);
}

export default app({ cache: 21600 }).get(handler);

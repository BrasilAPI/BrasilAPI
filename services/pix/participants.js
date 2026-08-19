import InternalError from '@/errors/InternalError';
import participants from './snapshots/latest.json';

/**
 * O BCB descontinuou o CSV público de participantes do Pix (a URL antiga
 * passou a responder 401) e a lista oficial hoje só é publicada em PDF.
 * A extração do PDF é feita fora do request, pelo script
 * `scripts/generate-pix-participants-snapshot.js` (agendado via GitHub
 * Action), que versiona o snapshot em `services/pix/snapshots/latest.json`
 * já no formato de resposta da rota.
 */
export const getPixParticipants = () => {
  if (!Array.isArray(participants) || participants.length === 0) {
    throw new InternalError({
      status: 500,
      message:
        'Erro ao obter as informações do BCB ou informações inexistentes',
      name: 'PIX_LIST_ERROR',
      type: 'PIX_LIST_ERROR',
    });
  }

  return participants;
};

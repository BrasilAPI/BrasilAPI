import app from '@/app';
import { getEstados, getSnapshotMetadata } from '@/services/hospitais';

// Expõe o frescor por UF coletado junto com o snapshot: num dado de saúde,
// "de quando é isso?" importa tanto quanto o dado em si.
async function listarEstados(request, response) {
  const estados = getEstados();

  return response.status(200).json({
    total: estados.length,
    ...getSnapshotMetadata(),
    items: estados,
  });
}

export default app({ cache: 86400 }).get(listarEstados);

import app from '@/app';
import {
  contarPorAtendimento,
  contarPorVertical,
  getSnapshotMetadata,
} from '@/services/hospitais';

// Torna a API auto-descritiva: sem isso, descobrir que o soro para cascavel se
// chama "Crotalic" ou que radioterapia cobre cinco códigos de portaria exige
// ler a documentação.
async function listarOpcoes(request, response) {
  return response.status(200).json({
    ...getSnapshotMetadata(),
    verticais: contarPorVertical(),
    atendimentos: contarPorAtendimento(),
  });
}

export default app({ cache: 86400 }).get(listarOpcoes);

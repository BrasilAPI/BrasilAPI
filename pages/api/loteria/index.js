
import app from '@/app';
import { getLoteriaResults } from '@/services/loteria';

const action = async (request, response) => {
  try {

    const allLoteriaData = await getLoteriaResults();

  
    const premios = allLoteriaData.listaRateioPremio.map(premio => ({
      descricaoFaixa: premio.descricaoFaixa,
      valorPremio: premio.valorPremio
    }));

  
    response.status(200).json(premios);
  } catch (error) {
 
    console.error("Error:", error);
    response.status(500).json({
      message: 'Error: 500',
      type: 'INTERNAL_SERVER_ERROR',
    });
  }
};

export default app().get(action);

import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import { getServidores } from '@/services/dados-publicos-senado/servidores/index';

function checkVinculo(vinculo){
  const possibleValues = ['EXERCICIO_PROVISORIO', 'COMISSIONADO', 'REQUISITADO', 'PARLAMENTAR', 'EFETIVO'];

  return vinculo == null || possibleValues.includes(vinculo); 
}

function checkSituacao(situacao){
  const possibleValues = ['APOSENTADO', 'INATIVO', 'ATIVO', 'DESLIGADO'];

  return situacao == null || possibleValues.includes(situacao); 
}

async function getAllPublicServers(request, response) {
    try {
        
        const tipoVinculoEquals = request.query.tipoVinculoEquals;    
        const situacaoEquals = request.query.situacaoEquals;

        if(!checkSituacao(situacaoEquals) || !checkVinculo(tipoVinculoEquals)){
          throw new BadRequestError({message: "Parâmetros inválidos"})
        }

        const lotacaoEquals = request.query.lotacaoEquals;
        const cargoEquals = request.query.cargoEquals;

        const result = await getServidores(tipoVinculoEquals, situacaoEquals, lotacaoEquals, cargoEquals);

        return response.status(200).json(result.data);

    } catch (error) {

      console.log(error.message);

      if (error.response.status === 400) {
        throw new BadRequestError({ message: 'Bad Request.' });
      }
        
      throw error;
    }
}
    
export default app().get(getAllPublicServers);
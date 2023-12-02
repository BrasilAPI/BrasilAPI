import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import { getHorasExtra } from '@/services/dados-publicos-senado/servidores/index';
import { verificarAnoMes } from '../../ano-mes-verificacao.js';


async function getAllHorasExtra(request, response) {
    try {
        const { ano, mes } = request.query;

        verificarAnoMes(ano, mes);
        
        const result = await getHorasExtra(ano, mes);

        response.status(200);
        return response.json(result);

        } catch (error) {

        console.log(error.message);

        if (error.response.status === 400) {
          throw new BadRequestError({ message: 'Bad Request.' });
        }
        
        throw error;
      }
    }
    
export default app().get(getAllHorasExtra);
import cidades from 'cidades-promise';
import microCors from 'micro-cors';

const CACHE_CONTROL_HEADER_VALUE = 'max-age=0, s-maxage=86400';
const cors = microCors();

/* retorna todas as cidades por meio da sigla do estado
 * exemplo da rota: estado/v1/sp 
 */
async function Cidades(request, response) {
    const requestedCidades = request.query.estado;

    response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

    try {
        const cidadesResult = await cidades(requestedCidades);
        console.log(cidadesResult);
        
        response.status(200);
        response.json(cidadesResult);

    } catch (error) {
        if (error.name === 'cidadesPromiseError') {
            response.status(404);
            response.json(error);
            return;
        }

        response.status(500);
        response.json(error);
    }
}
export default cors(Cidades);
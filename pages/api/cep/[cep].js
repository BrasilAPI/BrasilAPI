import cep from 'cep-promise';

export default async function Cep(request, response) {
    const requestedCep = request.query.cep;

    try {
        const cepResult = await cep(requestedCep);

        response.status(200);
        response.json(cepResult);

    } catch (error) {
        if (error.name === 'CepPromiseError') {
            response.status(404);
            response.json(error);
            return;
        }

        response.status(500);
        response.json(error);
    }
}
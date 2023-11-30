const axios = require('axios');

// URL da API dos Correios para consulta de restrições de entrega
const correiosApi = 'https://www2.correios.com.br/sistemas/precosPrazos/restricaoentrega/resultado.cfm';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// Função para construir parâmetros de requisição para a API dos Correios
function buildParams(cepOrigem, cepDestino, serviceCode) {
    const params = new URLSearchParams();
    params.append('servico', serviceCode);
    params.append('cepOrigem', cepOrigem);
    params.append('cepDestino', cepDestino);

    return params.toString();
}

async function requestHtmlCorreios(cepOrigem, cepDestino, servico) {
    const params = buildParams(cepOrigem, cepDestino, servico);
    const response = await axios.post(correiosApi, params);

    return response.data;
}

exports.requestHtmlCorreios = requestHtmlCorreios;

// Importação dos módulos necessários e definição de classes de erro.
import app from '@/app';
import NotFoundError from '@/errors/NotFoundError';
import InternalError from '@/errors/InternalError';
import { requestHtmlCorreios } from '../../../../services/correios-restricao/index';
const jsdom = require('jsdom');

// Definição de constantes para mensagens de erro.
const ERROR_MESSAGES = {
    CEP_DESTINO_VAZIO: 'CEP de destino vazio',
    CEP_ORIGEM_VAZIO: 'CEP de origem vazio',
    CEP_ORIGEM_NOT_FOUND: 'CEP de origem não encontrado',
    CEP_DESTINO_NOT_FOUND: 'CEP de destino não encontrado',
    CEP_ORIGEM_INVALIDO: 'CEP de origem inválido',
    CEP_DESTINO_INVALIDO: 'CEP de destino inválido',
    ERRO_CONEXAO: 'Conexão recusada',
    ERRO_INFO: 'Erro ao buscar informações',
    ERRO_SERVICO: 'Serviço inexistente'
};

// Definição de códigos de serviços dos Correios.
const SERVICOS = {
    PAC: '04510',
    PAC_GRANDES_FORMATOS: '04693',
    PAC_PAGAMENTO_NA_ENTREGA: '04707',
    REMESSA_EXPRESSA_TALAO_CARTAO: '40622',
    SEDEX: '04014',
    SEDEX_PAGAMENTO_NA_ENTREGA: '04065'
};

// Padrões de alertas dos Correios definidos por expressões regulares.
const padroesAlertasCorreios = [
    {
        regex: /alert\(\'CEP de origem n.*o encontrado na base de dados dos Correios \(-1\).\'\)/,
        mensagem: ERROR_MESSAGES['CEP_ORIGEM_NOT_FOUND']
    },
    {
        regex: /alert\(\'CEP de destino n.*o encontrado na base de dados dos Correios \(-2\).\'\)/,
        mensagem: ERROR_MESSAGES['CEP_DESTINO_NOT_FOUND']
    },
    {
        regex: /alert\(\'CEP de destino inv.*lido.\'\)/,
        mensagem: ERROR_MESSAGES['CEP_DESTINO_INVALIDO']
    },
    {
        regex: /alert\(\'CEP inv.*lido.\'\)/,
        mensagem: ERROR_MESSAGES['CEP_ORIGEM_INVALIDO']
    }
];

// Função para verificar se existe algum alerta na resposta dos Correios.
function verificarAlertasCorreios(correiosData) {
    const padrao = padroesAlertasCorreios.find(p => p.regex.test(correiosData));
    return padrao ? { alerta: true, mensagem: padrao.mensagem } : { alerta: false, mensagem: '' };
}

// Função para validar a presença dos CEPs de origem e destino.
function validarCEP(cepOrigem, cepDestino) {
    if (!cepOrigem || !cepDestino) {
        throw new NotFoundError({
            message: !cepOrigem ? ERROR_MESSAGES['CEP_ORIGEM_VAZIO'] : ERROR_MESSAGES['CEP_DESTINO_VAZIO'],
            type: 'cep_error',
            name: 'CEP_NOT_FOUND',
        });
    }
}

// Função para analisar o HTML retornado pelos Correios e extrair informações.
function parseCorreiosHtml(correiosData) {
    const dom = new jsdom.JSDOM(correiosData);
    const errorDiv = dom.window.document.querySelector('div[class="info error"]');
    const positiveDiv = dom.window.document.querySelector('div[class="informativo-positivo"]');

    return { errorDiv, positiveDiv };
}

// Função principal que verifica restrições de entrega para um CEP.
const verifyRestriction = async (request, response) => {
    try {
        const {cepOrigem, cepDestino, servico} = request.query;

        // Verifica se o serviço solicitado é válido.
        if (!(servico in SERVICOS)) {
            throw new InternalError({
                message: ERROR_MESSAGES['ERRO_SERVICO'],
                type: 'internal_error',
                name: 'INTERNAL_ERROR',
            });
        }

        // Valida os CEPs fornecidos na requisição.
        validarCEP(cepOrigem, cepDestino);
        
        // Solicita os dados dos Correios e verifica por alertas.
        const correiosData = await requestHtmlCorreios(cepOrigem, cepDestino, SERVICOS[servico]);
        const verificarAlerta = verificarAlertasCorreios(correiosData);

        // Se um alerta for encontrado, lança um erro.
        if (verificarAlerta['alerta']) {
            throw new NotFoundError({
                message: verificarAlerta['mensagem'],
                type: 'cep_error',
                name: 'CEP_NOT_FOUND',
            });
        }

        // Processa o HTML para determinar restrições de entrega.
        const { errorDiv, positiveDiv } = parseCorreiosHtml(correiosData);
        
        // Resposta baseada na análise do HTML.
        if (errorDiv) {
            response.status(200).json('{"response": "CEP em zona restrita", "isDeliverable": false}');
            return;
        }

        if (positiveDiv) {
            response.status(200).json('{"response": "CEP sem restricao de entrega", "isDeliverable": true}');
            return;
        }

        // Caso não seja possível determinar a situação do CEP, lança um erro interno.
        throw new InternalError({
            message: ERROR_MESSAGES['ERRO_INFO'],
            type: 'internal_error',
            name: 'INTERNAL_ERROR',
        });
    } catch (err) {
        // Tratamento de diferentes tipos de erro que podem ocorrer.
        if (err.code === 'ECONNRESET') {
            throw new InternalError({
                message: ERROR_MESSAGES['ERRO_CONEXAO'],
                type: 'internal_error',
                name: 'INTERNAL_ERROR',
            });
        } else if (err instanceof NotFoundError) {
            throw err;
        } else {
            throw new InternalError({
                message: 'Erro interno ao obter informações: ' + err,
                type: 'internal_error',
                name: 'INTERNAL_ERROR',
            });
        }
    }
};

// Exporta a função para uso como endpoint da API.
export default app().get(verifyRestriction);

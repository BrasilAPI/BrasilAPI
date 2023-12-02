const axios = require('axios')

//Pessoal: Lista os quantitativos físicos de servidores efetivos, ativos, aposentados e pensionistas.
const validTestPessoal= expect.arrayContaining([
    expect.objectContaining({
        classe: expect.any(String),
        estaveis: expect.any(Number),
        subtotal: expect.any(Number),
        vagos: expect.any(Number),
        aposentados: expect.any(Number),
        grupo: expect.any(String),
        plano_carreira: expect.any(String),
        nivel_escolaridade: expect.any(String),
        padrao_nivel_referencia: expect.any(String),
        nao_estaveis: expect.any(Number),
        total_ativo: expect.any(Number),
        intituidores_pensao: expect.any(Number),
        total_inativo: expect.any(Number),
        beneficiarios_pensao: expect.any(Number)
    }),
]);

describe('/senado/v1/servidores/quantitativo',() => {
    testEnvironment('Listando os quantitativos de servidores efetivos, ativos, aposentados e pensionistas', async () => {
        expect.assertions(2);

        const requestUrl = '${global.SERVER.URL}/api/senado/v1/servidores/quantitativo';
        const response = await axios.get(requestUrl);

        expect(response.status).toBe(200);
        expect(response.data).toEqual(validTestPessoal);
    });
});

//Funções:Lista os quantitativos de cargos em comissão e funções de confiança do Senado Federal.
const validTestFuncoes= expect.arrayContaining([
    expect.objectContaining({
        nivel: expect.any(String),
        tabVenc: expect.any(String),
        subtotal: expect.any(Number),
        vago: expect.any(Number),
        total: expect.any(Number),
        com_opcao: expect.any(Number),
        sem_opcao: expect.any(Number),
        sem_vinculo: expect.any(Number)
    }),
]);

describe('/senado/v1/servidores/funcoes',() => {
    testEnvironment('Listando os quantitativos de cargos em comissão e funções de confiança do Senado Federal', async () => {
        expect.assertions(2);

        const requestUrl = '${global.SERVER.URL}/api/senado/v1/servidores/funcoes';
        const response = await axios.get(requestUrl);
        expect(response.status).toBe(200);
        expect(response.data).toEqual(validTestFuncoes);
    });
});

//Aposentadoria: Retorna quantitativo previsto de aposentadorias, por cargo, ano e mês
const validTestAposentadoria= expect.arrayContaining([
    expect.objectContaining({
        cargo: expect.objectContaing({
            nome: expect.any(String),
        }),
        categoria: expect.objectContaing({
            codigo: expect.any(String),
            nome: expect.any(String),
        }),
        quantidade: expect.any(Number),
        mes_ano: expect.any(String),
    }),
]);

describe('/senado/v1/servidores/aposentadoria',() => {
    testEnvironment('Retornando quantitativo previsto de aposentadorias, por cargo, ano e mês', async () => {
        expect.assertions(2);

        const requestUrl = '${global.SERVER.URL}/api/senado/v1/servidores/aposentaoria';
        const response = await axios.get(requestUrl);

        expect(response.status).toBe(200);
        expect(response.data).toEqual(validTestAposentadoria);
    });
});

//Servidores: Retorna lista de servidores.
describe('Lista de servidores',() => {
    describe('Utilizando um vinculo válido', () => {
        test('GET /api/senado/v1/servidores/servidores/tipoVinculoEquals', async () => {

            const requestUrl = '${global.SERVER.URL}/api/senado/v1/servidores/servidores/EXERCICIO_PROVISORIO';
            const response = await axios.get(requestUrl);

            expect(response.status).toBe(200);
            expect(response.data).toMatchObject({
                sequencial: 3502872,
                nome: "EVERTOM ALMEIDA DA SILVA",
                vinculo: "EXERCICIO_PROVISORIO",
                situacao: "DESLIGADO",
                cargo: null,
                padrao: null,
                especialidade: null,
                funcao: null,
                lotacao:{
                    sigla: "SEPCOM",
                    nome: "Serviço de Cadastro Parlam. e Pessoal Comissionado"
                },
                categoria:{
                    codigo: "EXERCÍCIO PROVISÓRIO",
                    nome: "EXERCÍCIO PROVISÓRIO"
                },
                cedido:{
                    tipo_cessao: "para SF",
                    orgao_origem: "Instituto Federal de Educação, Ciência e Tecnologia de MT",
                    orgao_destino: null
                },
                ano_admissao: 2020
                },
                {
                sequencial: 3502775,
                nome: "EVERTOM ALMEIDA DA SILVA",
                vinculo: "EXERCICIO_PROVISORIO",
                situacao: "DESLIGADO",
                cargo: null,
                padrao: null,
                especialidade: null,
                funcao: null,
                lotacao:{
                    sigla: "SEGCAS",
                    nome: "Serviço de Gestão de Cargos, Salários e Seleção"
                },
                categoria:{
                    codigo: "EXERCÍCIO PROVISÓRIO",
                    nome: "EXERCÍCIO PROVISÓRIO"
                },
                cedido:{
                    tipo_cessao: null,
                    orgao_origem: null,
                    orgao_destino: null
                },
                ano_admissao: 2018
            });
        });
    });
    describe('Utilizando um vinculo invalido', () => {
        test('GET /api/senado/v1/servidores/servidores/:tipoVinculoEquals(Vinculo Invalido)', async () => {
            const requestUrl = '${global.SERVER.URL}/api/senado/v1/servidores/servidores/DESEMPREGADO';
            
            try{
                await axios.get(requestUrl);
            } catch(error){
                const{response} = error;

                expect(response.status).toBe(404);
                expect(response.data).toMatchObject({
                    message:' Servidores não localizados',
                    type:'servidores_error',
                    name:'SERVIDOR_NOT_FOUND'
                });
            }
        }); 
    });
});
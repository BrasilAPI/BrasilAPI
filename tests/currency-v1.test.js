// Testes para pages/api/currency/[...params].js

const axios = require('axios');

// URL base para as requisições de teste à API de conversão de moedas.
const requestUrl = `http://localhost:3000/api/currency`;

// Agrupamento de testes para a API de conversão de moedas.
describe('API Currency Rate (E2E)', () => {

  // Teste para verificar o comportamento da API com parâmetros válidos (EUR para USD).
  test('Utilizando parâmetros válidos: EUR para USD', async () => {
    const response = await axios.get(`${requestUrl}/EUR/USD`);
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(typeof data.value).toBe('number');
  });

  // Teste para verificar a resposta da API com parâmetros inválidos (ABC para XYZ).
  test('Utilizando parâmetros inválidos: ABC para XYZ', async () => {
    try {
      await axios.get(`${requestUrl}/ABC/XYZ`);
    } catch (error) {
      const { response } = error;
      const { status } = response;
  
      expect(status).toEqual(404);
    }
  });

  // Teste para verificar a resposta da API quando são fornecidos menos parâmetros do que o necessário.
  test('Utilizando menos parâmetros do que o necessário', async () => {
    try {
      await axios.get(`${requestUrl}/EUR`);
    } catch (error) {
      const { response } = error;
      const { status } = response;
      
      expect(status).toEqual(400);
    }
  });
});

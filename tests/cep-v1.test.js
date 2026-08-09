import axios from 'axios';
import { describe, expect, it, test } from 'vitest';

import { testCorsForRoute } from './helpers/cors';

describe('/cep/v1 (E2E)', () => {
  test('Verifica CORS', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cep/v1/05010000`;
    const response = await axios.get(requestUrl);

    expect(response.headers['access-control-allow-origin']).toBe('*');
  });

  test('Utilizando um CEP válido: 05010000', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cep/v1/05010000`;
    const response = await axios.get(requestUrl);

    expect(response.data).toMatchObject({
      cep: '05010000',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Perdizes',
      street: 'Rua Caiubi',
      service: expect.any(String),
      ibge: {
        state: '35',
      },
    });
    expect(
      response.data.ibge.city === null ||
        typeof response.data.ibge.city === 'string'
    ).toBe(true);
  });

  test('Verifica fonte da informação: 05010000', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cep/v1/05010000`;
    const response = await axios.get(requestUrl);

    expect(response.data).toMatchObject({
      cep: '05010000',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Perdizes',
      street: 'Rua Caiubi',
      service: 'open-cep',
      ibge: {
        city: '3550308',
        state: '35',
      },
    });
  });

  test('Utilizando um CEP inexistente: 00000000', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/cep/v1/00000000`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(404);
      expect(response.data).toMatchObject({
        name: 'CepPromiseError',
        message: 'Todos os serviços de CEP retornaram erro.',
        type: 'service_error',
      });
    }
  });

  test('Utilizando um CEP inválido: 999999999999999', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/cep/v1/999999999999999`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        name: 'CepPromiseError',
        message: 'CEP deve conter exatamente 8 caracteres.',
        type: 'validation_error',
        errors: [
          {
            message: 'CEP informado possui mais do que 8 caracteres.',
            service: 'cep_validation',
          },
        ],
      });
    }
  });

  test('Utilizando um CEP inválido com menos de 8 caracteres: 0123', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/cep/v1/0123`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        name: 'CepPromiseError',
        message: 'CEP deve conter exatamente 8 caracteres.',
        type: 'validation_error',
        errors: [
          {
            message: 'CEP informado possui menos do que 8 caracteres.',
            service: 'cep_validation',
          },
        ],
      });
    }
  });
  test('Utilizando um CEP com separador em posicao invalida: 002123-25', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/cep/v1/002123-25`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        name: 'CepPromiseError',
        message: 'CEP deve conter exatamente 8 caracteres.',
        type: 'validation_error',
        errors: [
          {
            message:
              'CEP informado deve conter apenas números ou seguir o formato 00000-000.',
            service: 'cep_validation',
          },
        ],
      });
    }
  });
});

describe('/api/cep/v1/{cep} - Tratamento de Erros', () => {
  it('deve retornar mensagem padronizada do ViaCEP', async () => {
    try {
      await axios.get(`${global.SERVER_URL}/api/cep/v1/00000000`);
      throw new Error('Deveria ter lançado erro 404');
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(404);

      const data = response.data;
      expect(data).toHaveProperty('name', 'CepPromiseError');
      expect(data).toHaveProperty('type', 'service_error');

      const viacepError = data.errors.find((e) => e.service === 'viacep');
      expect(viacepError).toBeDefined();
      expect(viacepError.message).not.toContain('Cannot read properties');
      expect(viacepError.message).not.toContain('undefined');
      expect(viacepError.message).toMatch(/CEP não encontrado|CEP inválido/i);
    }
  });

  it('deve retornar mensagem padronizada dos Correios', async () => {
    const response = await axios.get(
      `${global.SERVER_URL}/api/cep/v1/00000000`,
      { validateStatus: () => true }
    );
    const data = response.data;

    expect(response.status).toBe(404);

    const correiosError = data.errors.find((e) => e.service === 'correios');
    expect(correiosError).toBeDefined();
    expect(correiosError.message).not.toContain('autenticacao');
    expect(correiosError.message).not.toContain('null falhou');
    expect(correiosError.message).toMatch(/CEP INVÁLIDO|CEP inválido/i);
  });

  it('deve retornar mensagens padronizadas para todos os serviços', async () => {
    const response = await axios.get(
      `${global.SERVER_URL}/api/cep/v1/00000000`,
      { validateStatus: () => true }
    );
    const data = response.data;

    expect(response.status).toBe(404);
    expect(data.errors).toHaveLength(4);

    const expectedMessages = {
      correios: 'CEP INVÁLIDO',
      viacep: 'CEP não encontrado na base do ViaCEP.',
      widenet: 'CEP não encontrado',
      'correios-alt': 'CEP não encontrado na base dos Correios.',
    };

    data.errors.forEach((error) => {
      expect(expectedMessages).toHaveProperty(error.service);
      expect(error.message).toBe(expectedMessages[error.service]);
      expect(error.name).toBe('ServiceError');
    });
  });
});

describe('/api/cep/v1/{cep} - Testes de Regressão', () => {
  it('deve retornar dados corretos para CEP válido', async () => {
    const response = await axios.get(
      `${global.SERVER_URL}/api/cep/v1/01001-000`
    );
    const data = response.data;

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('cep');
    expect(data).toHaveProperty('state');
    expect(data).toHaveProperty('city');
    expect(data).toHaveProperty('street');
    expect(data).toHaveProperty('neighborhood');
    expect(data.cep).toMatch(/^\d{5}-?\d{3}$/);
    expect(data.state).toBeTruthy();
    expect(data.city).toBeTruthy();
  });

  it('deve retornar dados corretos para CEP sem hífen', async () => {
    const response = await axios.get(
      `${global.SERVER_URL}/api/cep/v1/01001000`
    );
    const data = response.data;

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('cep');
    expect(data.cep).toMatch(/^\d{8}$|^\d{5}-\d{3}$/);
  });
});

describe('/api/cep/v1/{cep} - Testes de Integração', () => {
  const malformedCases = [
    { cep: '000000-00', description: 'CEP com zeros' },
    { cep: '999999-99', description: 'CEP inexistente' },
    { cep: '123456-78', description: 'CEP fora do padrão' },
    { cep: '002123-25', description: 'CEP mal formatado original' },
  ];

  malformedCases.forEach(({ cep, description }) => {
    it(`deve tratar como 400: ${description}`, async () => {
      const response = await axios.get(`${global.SERVER_URL}/api/cep/v1/${cep}`, {
        validateStatus: () => true,
      });
      const data = response.data;

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('name', 'CepPromiseError');
      expect(data).toHaveProperty('type', 'validation_error');

      // Nenhum erro deve conter mensagens técnicas
      data.errors.forEach((error) => {
        expect(error.message).not.toContain('Cannot read properties');
        expect(error.message).not.toContain('undefined');
        expect(error.message).not.toContain('autenticacao');
        expect(error.message).not.toContain('null falhou');
        expect(error.message).not.toMatch(/conectar com o serviço/i);
      });
    });
  });

  it('deve tratar como 404 service_error: CEP válido inexistente 00000000', async () => {
    const response = await axios.get(
      `${global.SERVER_URL}/api/cep/v1/00000000`,
      { validateStatus: () => true }
    );
    const data = response.data;

    expect(response.status).toBe(404);
    expect(data).toHaveProperty('name', 'CepPromiseError');
    expect(data).toHaveProperty('type', 'service_error');
    expect(data.errors).toBeDefined();

    // Nenhum erro deve conter mensagens técnicas
    data.errors.forEach((error) => {
      expect(error.message).not.toContain('Cannot read properties');
      expect(error.message).not.toContain('undefined');
      expect(error.message).not.toContain('autenticacao');
      expect(error.message).not.toContain('null falhou');
      expect(error.message).not.toMatch(/conectar com o serviço/i);
    });
  });
});

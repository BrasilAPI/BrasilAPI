import { describe, it, expect } from 'vitest';
import axios from 'axios';

describe('/api/cep/v1/{cep} - Tratamento de Erros', () => {
  it('deve retornar mensagem padronizada do ViaCEP para CEP mal formatado', async () => {
    try {
      await axios.get('http://localhost:3000/api/cep/v1/002123-25');
      throw new Error('Deveria ter lançado erro 404');
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(404);
      
      const data = response.data;
      expect(data).toHaveProperty('name', 'CepPromiseError');
      expect(data).toHaveProperty('type', 'service_error');
      
      const viacepError = data.errors.find(e => e.service === 'viacep');
      expect(viacepError).toBeDefined();
      expect(viacepError.message).not.toContain('Cannot read properties');
      expect(viacepError.message).not.toContain('undefined');
      expect(viacepError.message).toMatch(/CEP não encontrado|CEP inválido/i);
    }
  });

  it('deve retornar mensagem padronizada dos Correios para CEP mal formatado', async () => {
    const response = await fetch('http://localhost:3000/api/cep/v1/002123-25');
    const data = await response.json();

    expect(response.status).toBe(404);

    const correiosError = data.errors.find(e => e.service === 'correios');
    expect(correiosError).toBeDefined();
    expect(correiosError.message).not.toContain('autenticacao');
    expect(correiosError.message).not.toContain('null falhou');
    expect(correiosError.message).toMatch(/CEP INVÁLIDO|CEP inválido/i);
  });

  it('deve retornar mensagens padronizadas para todos os serviços', async () => {
    const response = await fetch('http://localhost:3000/api/cep/v1/002123-25');
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.errors).toHaveLength(4);

    const expectedMessages = {
      'correios': 'CEP INVÁLIDO',
      'viacep': 'CEP não encontrado na base do ViaCEP.',
      'widenet': 'CEP não encontrado',
      'correios-alt': 'CEP não encontrado na base dos Correios.'
    };

    data.errors.forEach(error => {
      expect(expectedMessages).toHaveProperty(error.service);
      expect(error.message).toBe(expectedMessages[error.service]);
      expect(error.name).toBe('ServiceError');
    });
  });
});

describe('/api/cep/v1/{cep} - Testes de Regressão', () => {
  it('deve retornar dados corretos para CEP válido', async () => {
    const response = await fetch('http://localhost:3000/api/cep/v1/01001-000');
    const data = await response.json();

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
    const response = await fetch('http://localhost:3000/api/cep/v1/01001000');
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('cep');
    expect(data.cep).toMatch(/^\d{8}$|^\d{5}-\d{3}$/);
  });
});

describe('/api/cep/v1/{cep} - Testes de Integração', () => {
  const testCases = [
    { cep: '000000-00', description: 'CEP com zeros' },
    { cep: '999999-99', description: 'CEP inexistente' },
    { cep: '123456-78', description: 'CEP fora do padrão' },
    { cep: '002123-25', description: 'CEP mal formatado original' },
  ];

  testCases.forEach(({ cep, description }) => {
    it(`deve tratar corretamente: ${description}`, async () => {
      const response = await fetch(`http://localhost:3000/api/cep/v1/${cep}`);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty('name', 'CepPromiseError');
      expect(data).toHaveProperty('type', 'service_error');
      expect(data.errors).toBeDefined();

      // Nenhum erro deve conter mensagens técnicas
      data.errors.forEach(error => {
        expect(error.message).not.toContain('Cannot read properties');
        expect(error.message).not.toContain('undefined');
        expect(error.message).not.toContain('autenticacao');
        expect(error.message).not.toContain('null falhou');
        expect(error.message).not.toMatch(/conectar com o serviço/i);
      });
    });
  });
});

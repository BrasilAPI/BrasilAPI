// tests/cep-timeout.test.js
// Testa que updateOpenCep NÃO bloqueia a resposta quando OpenCEP falha.
// Mocka o axios para simular OpenCEP fora do ar e mede a latência real do fetchCep.

import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import { fetchCep } from '../services/cep/cep';

vi.mock('axios');

describe('fetchCep — updateOpenCep não deve bloquear a resposta', () => {
  it('responde em menos de 4s mesmo com OpenCEP + update indisponíveis', async () => {
    // Simula: opencep.com/v1 NÃO responde (timeout de 3s)
    //         update.opencep.com NÃO responde (timeout de 3s)
    //         viacep (fallback) responde normalmente
    axios.get.mockImplementation((url) => {
      if (url.includes('opencep.com')) {
        // OpenCEP fora do ar — nunca resolve (timeout do axios = 3s)
        return new Promise((_, reject) => {
          setTimeout(() => {
            reject(
              Object.assign(new Error('timeout'), { code: 'ECONNABORTED' })
            );
          }, 3000);
        });
      }
      if (url.includes('viacep.com.br')) {
        // ViaCEP (fallback) — responde rápido
        return Promise.resolve({
          data: {
            cep: '05010000',
            uf: 'SP',
            localidade: 'São Paulo',
            bairro: 'Perdizes',
            logradouro: 'Rua Caiubi',
          },
        });
      }
      if (url.includes('update.opencep.com')) {
        // Update também fora do ar
        return new Promise((_, reject) => {
          setTimeout(() => {
            reject(
              Object.assign(new Error('timeout'), { code: 'ECONNABORTED' })
            );
          }, 3000);
        });
      }
      return Promise.reject(new Error(`unexpected URL: ${url}`));
    });

    const start = Date.now();
    const result = await fetchCep('05010000');
    const elapsed = Date.now() - start;

    // Deve retornar o CEP pelos fallbacks
    expect(result.cep).toBe('05010000');
    expect(result.city).toBe('São Paulo');

    // O updateOpenCep NÃO deve bloquear — resposta < 4s
    // (3s do fetchOpenCep + ~0.5s dos fallbacks, sem os 3s extras do update)
    expect(elapsed).toBeLessThan(4000);
  }, 10000);
});

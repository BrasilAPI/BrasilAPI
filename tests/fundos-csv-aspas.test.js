// tests/fundos-csv-aspas.test.js
// Testa que o parse do cad_fi.csv não descarta linhas quando um campo de texto
// começa com aspas. Mocka o axios para servir um CSV pequeno no formato da CVM.

import axios from 'axios';
import { describe, expect, test, vi } from 'vitest';
import { getFundDetails, getFunds } from '../services/cvm/fundos';

vi.mock('axios');

const csv = [
  'TP_FUNDO;CNPJ_FUNDO;DENOM_SOCIAL;SIT;INF_TAXA_PERFM',
  'FI;11.111.111/0001-11;FUNDO ANTES DAS ASPAS;CANCELADA;',
  'FI;22.222.222/0001-22;FUNDO COM ASPAS;CANCELADA;"1" é o percentual',
  'FI;33.333.333/0001-33;FUNDO DEPOIS DAS ASPAS;CANCELADA;',
].join('\r\n');

axios.get.mockResolvedValue({ data: Buffer.from(csv, 'latin1') });

describe('cad_fi.csv com campo começando por aspas', () => {
  test('lê todas as linhas do arquivo', async () => {
    const { data } = await getFunds(100, 1);

    expect(data).toHaveLength(3);
  });

  test('encontra o fundo que vem depois da linha com aspas', async () => {
    const fund = await getFundDetails('33333333000133');

    expect(fund.denominacao_social).toBe('FUNDO DEPOIS DAS ASPAS');
  });

  test('mantém o texto com aspas no próprio campo', async () => {
    const fund = await getFundDetails('22222222000122');

    expect(fund.informacao_taxa_performance).toBe('"1" é o percentual');
  });
});

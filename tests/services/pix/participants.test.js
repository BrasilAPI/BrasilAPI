import { describe, expect, test } from 'vitest';

import { formatCsvFile } from '@/services/pix/participants';

describe('formatCsvFile', () => {
  test('normalizes CRLF and surrounding whitespace', () => {
    const csv = [
      'Lista de participantes ativos do Pix',
      'CNPJ ; Nome Reduzido ; ISPB ; Nome Extenso ; Inicio ; Fim ; Tipo de Participação no SPI ; Status ; Modalidade de Participação no Pix',
      ' 00000000000191 ; Banco Teste ; 12345678 ; Banco Teste S.A. ; 2020-01-01 ; ; Direta ; Ativo ; Participante ',
      '   ',
    ].join('\r\n');

    expect(formatCsvFile(csv)).toEqual([
      {
        ispb: '12345678',
        nome: 'Banco Teste',
        nome_reduzido: 'Banco Teste',
        modalidade_participacao: 'Participante',
        tipo_participacao: 'Direta',
        inicio_operacao: null,
      },
    ]);
  });
});

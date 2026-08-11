import { describe, expect, test } from 'vitest';

import {
  extrairCodigos,
  opcoesDeAtendimento,
  resolverAtendimento,
  VERTICAIS,
} from '@/services/hospitais/vocabulario';

describe('resolverAtendimento', () => {
  test('nome popular do animal resolve para o soro canônico', () => {
    expect(resolverAtendimento('cascavel')).toEqual({
      tipo: 'soro',
      soro: 'Crotalic',
    });
    expect(resolverAtendimento('jararaca')).toEqual({
      tipo: 'soro',
      soro: 'Bothropic',
    });
  });

  test('acento, caixa, hífen e underscore são equivalentes', () => {
    const referencia = resolverAtendimento('terapia-genica');

    expect(referencia).not.toBeNull();
    [
      'terapia_genica',
      'Terapia Gênica',
      'gene-therapy',
      'GENE THERAPY',
    ].forEach((grafia) => {
      expect(resolverAtendimento(grafia)).toEqual(referencia);
    });

    expect(resolverAtendimento('ESCORPIÃO')).toEqual({
      tipo: 'soro',
      soro: 'Scorpionic',
    });
  });

  test('capacidade de habilitação cobre múltiplos códigos de portaria', () => {
    const radioterapia = resolverAtendimento('radioterapia');

    expect(radioterapia.tipo).toBe('habilitacao');
    expect(radioterapia.prefixo).toBe('17');
    expect(radioterapia.codigos).toEqual(['04', '07', '12', '13', '15']);
  });

  test('código de portaria cru, com e sem ponto', () => {
    expect(resolverAtendimento('17.07')).toMatchObject({
      tipo: 'habilitacao',
      prefixo: '17',
      codigos: ['07'],
    });
    expect(resolverAtendimento('3516')).toMatchObject({
      prefixo: '35',
      codigos: ['16'],
    });
  });

  test('termo fora do vocabulário devolve null, nunca lança', () => {
    ['cascavell', 'xyz', '', '99.99', '17.7'].forEach((termo) => {
      expect(resolverAtendimento(termo)).toBeNull();
    });
  });
});

describe('extrairCodigos', () => {
  test('extrai vários códigos de um texto de OCR concatenado por quebra de linha', () => {
    // Formato real vindo das planilhas de doenças raras do MS.
    const specialties = [
      {
        qualification_codes: [
          '35.07- Serviço de Referência Eixo I DR de Origem Genética: 1- Anomalias Congênitas\n' +
            '35.08- Serviço de Referência Eixo I DR de Origem Genética: 2- Deficiência Intelectual\n' +
            '35.15- Serviço de Aconselhamento Genético',
        ],
      },
    ];

    expect([...extrairCodigos(specialties, '35')].sort()).toEqual([
      '07',
      '08',
      '15',
    ]);
  });

  test('tolera o ponto ausente e o espaçamento irregular do OCR', () => {
    const specialties = [
      {
        qualification_codes: ['3501- Atenção Especializada', '35. 02- Eixo I'],
      },
    ];

    expect([...extrairCodigos(specialties, '35')].sort()).toEqual(['01', '02']);
  });

  test('não mistura prefixos de verticais diferentes', () => {
    const specialties = [{ qualification_codes: ['17.07', '35.16'] }];

    expect([...extrairCodigos(specialties, '17')]).toEqual(['07']);
    expect([...extrairCodigos(specialties, '35')]).toEqual(['16']);
  });

  test('entrada ausente ou prefixo desconhecido devolvem conjunto vazio', () => {
    expect(extrairCodigos(undefined, '17').size).toBe(0);
    expect(extrairCodigos([], '17').size).toBe(0);
    expect(
      extrairCodigos([{ qualification_codes: ['17.07'] }], '99').size
    ).toBe(0);
  });
});

describe('opcoesDeAtendimento', () => {
  test('todo valor anunciado resolve no próprio vocabulário', () => {
    const opcoes = opcoesDeAtendimento();

    expect(opcoes.length).toBeGreaterThan(20);
    opcoes.forEach((opcao) => {
      expect(resolverAtendimento(opcao.valor)).not.toBeNull();
    });
  });

  test('valores são únicos e cada um pertence a uma vertical conhecida', () => {
    const opcoes = opcoesDeAtendimento();
    const valores = opcoes.map((opcao) => opcao.valor);

    expect(new Set(valores).size).toBe(valores.length);
    opcoes.forEach((opcao) => {
      expect(Object.keys(VERTICAIS)).toContain(opcao.vertical);
    });
  });
});

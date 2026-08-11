import { describe, expect, test } from 'vitest';
import axios from 'axios';

import { testCorsForRoute } from './helpers/cors';

const BASE = () => `${global.SERVER_URL}/api/hospitais/v1`;

const BAD_REQUEST = { response: { status: 400 } };

describe('/hospitais/v1 (E2E)', () => {
  test('Lista hospitais e devolve o envelope de paginação', async () => {
    const { status, data } = await axios.get(`${BASE()}?limit=5`);

    expect(status).toBe(200);
    expect(data).toMatchObject({
      total: expect.any(Number),
      limit: 5,
      offset: 0,
      atualizado_em: expect.any(String),
      fonte: expect.objectContaining({ nome: 'MapaSUS', oficial: false }),
      emergencia: expect.objectContaining({ samu: '192' }),
    });
    expect(data.items).toHaveLength(5);
    expect(data.total).toBeGreaterThan(data.items.length);
  });

  test('Cada hospital traz os campos essenciais', async () => {
    const { data } = await axios.get(`${BASE()}?limit=1`);

    expect(data.items[0]).toMatchObject({
      id: expect.any(Number),
      state_code: expect.stringMatching(/^[A-Z]{2}$/),
      city: expect.any(String),
      name: expect.any(String),
      verticals: expect.any(Array),
      requires_verification: expect.any(Boolean),
    });
  });

  test('Filtra por UF', async () => {
    const { data } = await axios.get(`${BASE()}?uf=AC&limit=500`);

    expect(data.total).toBeGreaterThan(0);
    expect(data.items.every((h) => h.state_code === 'AC')).toBe(true);
  });

  test('Filtra por vertical', async () => {
    const { data } = await axios.get(
      `${BASE()}?vertical=oncologia&uf=SP&limit=500`
    );

    expect(data.total).toBeGreaterThan(0);
    expect(data.items.every((h) => h.verticals.includes('oncology'))).toBe(
      true
    );
  });

  test('Busca por município ignora acento e caixa', async () => {
    const comAcento = await axios.get(`${BASE()}?municipio=São Paulo&uf=SP`);
    const semAcento = await axios.get(`${BASE()}?municipio=sao paulo&uf=SP`);

    expect(semAcento.data.total).toBe(comAcento.data.total);
    expect(semAcento.data.total).toBeGreaterThan(0);
  });

  test('Pagina com offset sem repetir registros', async () => {
    const primeira = await axios.get(`${BASE()}?limit=3&offset=0`);
    const segunda = await axios.get(`${BASE()}?limit=3&offset=3`);

    const ids = [
      ...primeira.data.items.map((h) => h.id),
      ...segunda.data.items.map((h) => h.id),
    ];

    expect(new Set(ids).size).toBe(6);
    expect(segunda.data.offset).toBe(3);
  });

  test('Limita o limit ao teto de 500', async () => {
    const { data } = await axios.get(`${BASE()}?limit=999999`);

    expect(data.limit).toBe(500);
    expect(data.items.length).toBeLessThanOrEqual(500);
  });

  test('Vertical inválida retorna 400', async () => {
    await expect(
      axios.get(`${BASE()}?vertical=inexistente`)
    ).rejects.toMatchObject(BAD_REQUEST);
  });

  test('UF inválida retorna 400', async () => {
    await expect(axios.get(`${BASE()}?uf=XYZ`)).rejects.toMatchObject(
      BAD_REQUEST
    );
  });

  test('Paginação inválida retorna 400', async () => {
    await expect(axios.get(`${BASE()}?limit=0`)).rejects.toMatchObject(
      BAD_REQUEST
    );
    await expect(axios.get(`${BASE()}?offset=-1`)).rejects.toMatchObject(
      BAD_REQUEST
    );
    await expect(axios.get(`${BASE()}?limit=abc`)).rejects.toMatchObject(
      BAD_REQUEST
    );
  });
});

describe('/hospitais/v1 busca por atendimento (E2E)', () => {
  test('Termo leigo, PT e EN convergem no mesmo soro', async () => {
    const [leigo, pt, en] = await Promise.all([
      axios.get(`${BASE()}?atendimento=cascavel`),
      axios.get(`${BASE()}?atendimento=crotalico`),
      axios.get(`${BASE()}?atendimento=Crotalic`),
    ]);

    expect(leigo.data.total).toBeGreaterThan(0);
    expect(pt.data.total).toBe(leigo.data.total);
    expect(en.data.total).toBe(leigo.data.total);
    expect(
      leigo.data.items.every((h) => h.treatments.includes('Crotalic'))
    ).toBe(true);
  });

  test('Acento, caixa, hífen e underscore são equivalentes', async () => {
    const grafias = [
      'terapia-genica',
      'terapia_genica',
      'Terapia Gênica',
      'gene-therapy',
      '35.16',
    ];

    const totais = await Promise.all(
      grafias.map(async (grafia) => {
        const { data } = await axios.get(BASE(), {
          params: { atendimento: grafia },
        });
        return data.total;
      })
    );

    expect(totais[0]).toBeGreaterThan(0);
    expect(new Set(totais).size).toBe(1);
  });

  test('Atravessa as três verticais', async () => {
    const casos = [
      ['cascavel', 'venomous_animals'],
      ['radioterapia', 'oncology'],
      ['terapia-genica', 'rare_diseases'],
    ];

    await Promise.all(
      casos.map(async ([termo, vertical]) => {
        const { data } = await axios.get(`${BASE()}?atendimento=${termo}`);

        expect(data.total).toBeGreaterThan(0);
        expect(data.items.some((h) => h.verticals.includes(vertical))).toBe(
          true
        );
      })
    );
  });

  test('Habilitação por capacidade cobre múltiplos códigos de portaria', async () => {
    const capacidade = await axios.get(`${BASE()}?atendimento=radioterapia`);
    const umCodigo = await axios.get(`${BASE()}?atendimento=17.04`);

    expect(capacidade.data.total).toBeGreaterThan(umCodigo.data.total);
  });

  test('Combina com os demais filtros aplicando AND', async () => {
    const so = await axios.get(`${BASE()}?atendimento=cascavel&limit=500`);
    const comUf = await axios.get(
      `${BASE()}?atendimento=cascavel&uf=SP&limit=500`
    );

    expect(comUf.data.total).toBeLessThan(so.data.total);
    expect(
      comUf.data.items.every(
        (h) => h.state_code === 'SP' && h.treatments.includes('Crotalic')
      )
    ).toBe(true);
  });

  test('Termo desconhecido retorna 400, não lista vazia', async () => {
    await expect(
      axios.get(`${BASE()}?atendimento=cascavell`)
    ).rejects.toMatchObject(BAD_REQUEST);
  });
});

describe('/hospitais/v1 procedência e aviso de emergência (E2E)', () => {
  test('Toda rota deixa claro que não é serviço oficial do MS', async () => {
    const rotas = ['?limit=1', '/ciatox', '/opcoes'];

    await Promise.all(
      rotas.map(async (rota) => {
        const { data } = await axios.get(`${BASE()}${rota}`);

        expect(data.fonte.oficial).toBe(false);
        expect(data.fonte.aviso).toMatch(/não são serviços oficiais/i);
        expect(data.fonte.documentos_de_origem).toMatch(/Ministério da Saúde/);
      })
    );
  });

  test('Toda rota orienta a ligar para o SAMU antes de se deslocar', async () => {
    const rotas = ['?limit=1', '/ciatox', '/opcoes'];

    await Promise.all(
      rotas.map(async (rota) => {
        const { data } = await axios.get(`${BASE()}${rota}`);

        expect(data.emergencia.samu).toBe('192');
        expect(data.emergencia.aviso).toMatch(/192/);
        expect(data.emergencia.aviso).toMatch(
          /não substitui atendimento médico/i
        );
      })
    );
  });
});

describe('/hospitais/v1/opcoes (E2E)', () => {
  test('Descreve verticais e atendimentos com contagem', async () => {
    const { status, data } = await axios.get(`${BASE()}/opcoes`);

    expect(status).toBe(200);
    expect(data.verticais).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          valor: 'peconhentos',
          total: expect.any(Number),
        }),
        expect.objectContaining({
          valor: 'oncologia',
          total: expect.any(Number),
        }),
        expect.objectContaining({ valor: 'raras', total: expect.any(Number) }),
      ])
    );

    expect(data.atendimentos.length).toBeGreaterThan(20);
    expect(data.atendimentos[0]).toMatchObject({
      vertical: expect.any(String),
      valor: expect.any(String),
      rotulo: expect.any(String),
      aliases: expect.any(Array),
      total: expect.any(Number),
    });
  });

  test('Todo valor anunciado é aceito pela busca', async () => {
    const { data } = await axios.get(`${BASE()}/opcoes`);
    const amostra = data.atendimentos.filter((_, i) => i % 4 === 0);

    const resultados = await Promise.all(
      amostra.map(async (opcao) => {
        const resposta = await axios.get(BASE(), {
          params: { atendimento: opcao.valor, limit: 1 },
        });
        return {
          valor: opcao.valor,
          anunciado: opcao.total,
          real: resposta.data.total,
        };
      })
    );

    resultados.forEach(({ anunciado, real }) => expect(real).toBe(anunciado));
  });
});

describe('/hospitais/v1/proximos (E2E)', () => {
  test('Ordena por distância crescente e respeita o raio', async () => {
    const { status, data } = await axios.get(
      `${BASE()}/proximos?latitude=-23.55&longitude=-46.63&raio_km=50`
    );

    expect(status).toBe(200);
    expect(data.total).toBeGreaterThan(0);
    expect(data.raio_km).toBe(50);
    expect(data.origem).toEqual({ latitude: -23.55, longitude: -46.63 });

    const distancias = data.items.map((h) => h.distancia_metros);
    expect(distancias).toEqual([...distancias].sort((a, b) => a - b));
    expect(Math.max(...distancias)).toBeLessThanOrEqual(50000);
    expect(data.items[0].distancia_km).toBeTypeOf('number');
  });

  test('Um raio menor devolve um subconjunto do raio maior', async () => {
    const url = (raio) =>
      `${BASE()}/proximos?latitude=-23.55&longitude=-46.63&raio_km=${raio}&limit=500`;

    const perto = await axios.get(url(10));
    const longe = await axios.get(url(100));

    expect(perto.data.total).toBeLessThanOrEqual(longe.data.total);
  });

  test('Busca por município e UF resolve a origem', async () => {
    const { status, data } = await axios.get(
      `${BASE()}/proximos?municipio=Campinas&uf=SP&raio_km=30`
    );

    expect(status).toBe(200);
    expect(data.origem.latitude).toBeTypeOf('number');
    expect(data.origem.longitude).toBeTypeOf('number');
  });

  test('Sem origem retorna 400', async () => {
    await expect(axios.get(`${BASE()}/proximos`)).rejects.toMatchObject(
      BAD_REQUEST
    );
    await expect(
      axios.get(`${BASE()}/proximos?municipio=Campinas`)
    ).rejects.toMatchObject(BAD_REQUEST);
  });

  test('Raio fora do intervalo retorna 400', async () => {
    const origem = 'latitude=-23.55&longitude=-46.63';

    await expect(
      axios.get(`${BASE()}/proximos?${origem}&raio_km=0`)
    ).rejects.toMatchObject(BAD_REQUEST);
    await expect(
      axios.get(`${BASE()}/proximos?${origem}&raio_km=500`)
    ).rejects.toMatchObject(BAD_REQUEST);
  });

  test('CEP malformado retorna 400 e CEP inexistente retorna 404', async () => {
    await expect(axios.get(`${BASE()}/proximos?cep=abc`)).rejects.toMatchObject(
      BAD_REQUEST
    );

    await expect(
      axios.get(`${BASE()}/proximos?cep=00000000`)
    ).rejects.toMatchObject({ response: { status: 404 } });
  });

  test('Coordenada inválida retorna 400', async () => {
    await expect(
      axios.get(`${BASE()}/proximos?latitude=91&longitude=-46.63`)
    ).rejects.toMatchObject(BAD_REQUEST);
    await expect(
      axios.get(`${BASE()}/proximos?latitude=-23.55&longitude=abc`)
    ).rejects.toMatchObject(BAD_REQUEST);
  });
});

describe('/hospitais/v1/ciatox (E2E)', () => {
  test('Lista os centros CIATOX', async () => {
    const { status, data } = await axios.get(`${BASE()}/ciatox`);

    expect(status).toBe(200);
    expect(data.total).toBeGreaterThan(0);
    expect(data.items[0]).toMatchObject({
      id: expect.any(Number),
      state_code: expect.stringMatching(/^[A-Z]{2}$/),
      name: expect.any(String),
      phones: expect.any(Array),
    });
  });

  test('Filtra por UF', async () => {
    const { data } = await axios.get(`${BASE()}/ciatox?uf=SP`);

    expect(data.items.every((c) => c.state_code === 'SP')).toBe(true);
  });

  test('UF inválida retorna 400', async () => {
    await expect(axios.get(`${BASE()}/ciatox?uf=1`)).rejects.toMatchObject(
      BAD_REQUEST
    );
  });
});

testCorsForRoute('/api/hospitais/v1?limit=1');
testCorsForRoute('/api/hospitais/v1/opcoes');
testCorsForRoute('/api/hospitais/v1/ciatox');
testCorsForRoute('/api/hospitais/v1/proximos?latitude=-23.55&longitude=-46.63');

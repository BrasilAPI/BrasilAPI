import { describe, it, expect } from 'vitest';
import request from 'supertest';

const URL = 'http://localhost:3000';

describe('GET /api/feriados/v1/{ano}', () => {
  it('deve responder com status 200', async () => {
    const res = await request(URL).get('/api/feriados/v1/2024');
    expect(res.status).toBe(200);
  });

  it('deve retornar um array de feriados', async () => {
    const res = await request(URL).get('/api/feriados/v1/2024');
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('cada feriado deve conter date, name e type', async () => {
    const res = await request(URL).get('/api/feriados/v1/2024');

    expect(res.body.length).toBeGreaterThan(0);

    res.body.forEach((feriado) => {
      expect(feriado).toHaveProperty('date');
      expect(feriado).toHaveProperty('name');
      expect(feriado).toHaveProperty('type');
    });
  });

  it('deve retornar feriados correspondentes ao ano solicitado', async () => {
    const res = await request(URL).get('/api/feriados/v1/2024');

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);

    res.body.forEach((feriado) => {
      expect(feriado.date.startsWith('2024')).toBe(true);
    });
  });

  it('deve retornar erro 400 quando o ano for inválido', async () => {
    const res = await request(URL).get('/api/feriados/v1/abcd');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('deve retornar 404 quando não houver feriados para o ano informado', async () => {
    const res = await request(URL).get('/api/feriados/v1/1800');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });
});

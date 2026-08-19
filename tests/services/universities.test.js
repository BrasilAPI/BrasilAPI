import { describe, expect, test } from 'vitest';

import { getUniversities, getUniversitiesById } from '@/services/universities';

describe('getUniversities', () => {
  test('retorna a lista do snapshot com o contrato da rota', () => {
    const universities = getUniversities();

    expect(Array.isArray(universities)).toBe(true);
    expect(universities.length).toBeGreaterThan(2400);
  });

  test('todas as universidades seguem o formato de resposta', () => {
    const universities = getUniversities();

    universities.forEach((university) => {
      expect(university.id).toEqual(expect.any(Number));
      expect(university.full_name).toEqual(expect.any(String));
      expect(university.full_name.length).toBeGreaterThan(0);
      expect(university.name).toEqual(expect.any(String));
      expect(university.uf).toMatch(/^[A-Z]{2}$/);
      expect(university.ibge).toMatch(/^\d{7}$/);
      expect([expect.any(String), null]).toContainEqual(university.phone);
    });
  });

  test('não possui IDs duplicados', () => {
    const universities = getUniversities();
    const uniqueIds = new Set(universities.map((u) => u.id));

    expect(uniqueIds.size).toBe(universities.length);
  });

  test('id 1 é a UFMT (dados esperados do snapshot)', () => {
    const ufmt = getUniversitiesById(1);

    expect(ufmt).toMatchObject({
      id: 1,
      full_name: 'UNIVERSIDADE FEDERAL DE MATO GROSSO',
      name: 'UFMT',
      city: 'CUIABÁ',
      uf: 'MT',
    });
  });

  test('id inexistente retorna null', () => {
    expect(getUniversitiesById(99999999)).toBeNull();
  });
});

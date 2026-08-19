import { describe, expect, test } from 'vitest';

import axios from 'axios';

import universities from '../services/universities/snapshots/latest.json';

const requestUrl = (path = '') =>
  `${global.SERVER_URL}/api/universities/v1${path}`;

// A fonte é o snapshot versionado do Censo INEP (services/universities/snapshots/latest.json) —
// o provider antigo (api.universities.com.br) saiu do ar permanentemente.
const shouldSkipTests =
  !Array.isArray(universities) || universities.length === 0;

describe.skipIf(shouldSkipTests)('universities v1 (E2E)', () => {
  describe('GET /universities/v1/:id', () => {
    test('Utilizando um id válido: 1 (UFMT)', async () => {
      const response = await axios.get(requestUrl('/1'));

      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        id: 1,
        full_name: 'UNIVERSIDADE FEDERAL DE MATO GROSSO',
        name: 'UFMT',
        ibge: '5103403',
        city: 'CUIABÁ',
        uf: 'MT',
        zipcode: '78060900',
        street: 'AVENIDA FERNANDO CORREA DA COSTA',
        number: '2367',
        neighborhood: 'BOA ESPERANÇA',
        phone: null,
      });
    });

    test('Utilizando um id inválido existente fora do censo: 99999999', async () => {
      try {
        await axios.get(requestUrl('/99999999'));
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'Universidade não encontrada',
          type: 'UNIVERSITY_NOT_FOUND',
        });
      }
    });
  });

  describe('GET /universities/v1', () => {
    test('Retorna a lista completa de universidades', async () => {
      const response = await axios.get(requestUrl());

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(2400);
    });

    test('Cada registro segue o contrato', async () => {
      const response = await axios.get(requestUrl());
      const [first] = response.data;

      expect(Object.keys(first).sort()).toEqual(
        [
          'city',
          'full_name',
          'ibge',
          'id',
          'name',
          'neighborhood',
          'number',
          'phone',
          'street',
          'uf',
          'zipcode',
        ].sort()
      );
    });
  });
});

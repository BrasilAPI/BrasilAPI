import axios from 'axios';
import { describe, expect, test } from 'vitest';

const validOutputSchema = expect.objectContaining({
  ispb: expect.any(String),
  name: expect.any(String),
  code: expect.any(Number),
  fullName: expect.any(String),
  address_last_sync: expect.any(String),
  address_confidence: expect.stringMatching(/^(high|medium|low|none)$/),
});

const validAddressSource = [
  null,
  'bcb_sedes_exact_match',
  'cnpj_exact_match',
  'name_based_match',
];

const addressFields = [
  'street',
  'number',
  'complement',
  'district',
  'city',
  'state',
  'zipCode',
];

const validateOptionalAddressFields = (bank) => {
  expect(bank).toHaveProperty('cnpj');
  expect(bank).toHaveProperty('headquarters_address');
  expect(bank).toHaveProperty('address_source');
  expect(validAddressSource).toContain(bank.address_source);

  if (bank.headquarters_address !== null) {
    expect(typeof bank.headquarters_address).toBe('object');

    addressFields.forEach((field) => {
      expect(bank.headquarters_address).toHaveProperty(field);

      const fieldValue = bank.headquarters_address[field];
      const isNullableString =
        fieldValue === null || typeof fieldValue === 'string';

      expect(isNullableString).toBe(true);
    });
  }
};

describe('banks v1 (E2E)', () => {
  describe('GET /banks/v1/:code', () => {
    test('Verifica CORS', async () => {
      const requestUrl = `${global.SERVER_URL}/api/banks/v1/260`;
      const response = await axios.get(requestUrl);

      expect(response.headers['access-control-allow-origin']).toBe('*');
    });

    test('Utilizando um bank code válido: 260', async () => {
      const requestUrl = `${global.SERVER_URL}/api/banks/v1/260`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(validOutputSchema);

      expect(response.data.ispb).toBe('18236120');
      expect(response.data.name).toContain('NU PAGAMENTOS');
      expect(response.data.code).toBe(260);
      expect(response.data.fullName).toContain('NU PAGAMENTOS');

      validateOptionalAddressFields(response.data);
    });

    test('Utilizando um bank code válido (com vírgula no nome): 402', async () => {
      const requestUrl = `${global.SERVER_URL}/api/banks/v1/402`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(validOutputSchema);

      expect(response.data.ispb).toBe('36947229');
      expect(response.data.name).toContain('COBUCCIO');
      expect(response.data.code).toBe(402);
      expect(response.data.fullName).toContain('COBUCCIO');

      validateOptionalAddressFields(response.data);
    });

    test('Utilizando um código inexistente: 1111111', async () => {
      expect.assertions(2);
      const requestUrl = `${global.SERVER_URL}/api/banks/v1/1111111`;

      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'Código bancário não encontrado',
          type: 'BANK_CODE_NOT_FOUND',
        });
      }
    });
  });

  test('GET /banks/v1', async () => {
    const requestUrl = `${global.SERVER_URL}/api/banks/v1`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);

    const [firstBank] = response.data;

    expect(firstBank).toEqual(validOutputSchema);
    validateOptionalAddressFields(firstBank);
  });
});

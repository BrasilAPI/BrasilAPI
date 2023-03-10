const axios = require('axios');

describe('/indices/igpm/v1 (E2E)', () => {
  const API_URL = `${global.SERVER_URL}/api/indices/igpm/v1`;

  describe('/ - Simples', () => {
    test('should return a list of records', async () => {
      const response = await axios.get(API_URL);

      expect(response.status).toEqual(200);
      expect(response.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            value: expect.any(String),
            date: expect.any(String),
          }),
        ])
      );
    });
  });

  describe('/ultimos - Ultimos x indices', () => {
    test('should return a list of 5 records', async () => {
      const response = await axios.get(`${API_URL}/ultimos`, {
        params: {
          limit: 5,
        },
      });

      expect(response.status).toEqual(200);
      expect(response.data.length).toEqual(5);
      expect(response.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            value: expect.any(String),
            date: expect.any(String),
          }),
        ])
      );
    });

    test('should return error when limit is not provided', async () => {
      try {
        await axios.get(`${API_URL}/ultimos`, {
          params: {},
        });
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(400);
        expect(response.data.message).toEqual(
          'Limite inválido, informe um número maior ou igual a 1'
        );
      }
    });

    test('should return error when limit is less than zero', async () => {
      try {
        await axios.get(`${API_URL}/ultimos`, {
          params: {
            limit: -1,
          },
        });
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(400);
        expect(response.data.message).toEqual(
          'Limite inválido, informe um número maior ou igual a 1'
        );
      }
    });

    test('should return error when limit is equal zero', async () => {
      try {
        await axios.get(`${API_URL}/ultimos`, {
          params: {
            limit: 0,
          },
        });
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(400);
        expect(response.data.message).toEqual(
          'Limite inválido, informe um número maior ou igual a 1'
        );
      }
    });
  });

  describe('/intervalo - Intervalo de tempo', () => {
    test('should return a list of records', async () => {
      const response = await axios.get(`${API_URL}/intervalo`, {
        params: {
          initial_date: '20-01-2003',
          final_date: '20-01-2005',
        },
      });

      expect(response.status).toEqual(200);
      expect(response.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            value: expect.any(String),
            date: expect.any(String),
          }),
        ])
      );
    });

    test('should return error when initial_date is invalid', async () => {
      try {
        await axios.get(`${API_URL}/intervalo`, {
          params: {
            initial_date: null,
            final_date: '20-01-2005',
          },
        });
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(400);
        expect(response.data.message).toEqual(
          'Intervalo de datas inválido, informe um intervalo correto'
        );
      }
    });

    test('should return error when final_date is invalid', async () => {
      try {
        await axios.get(`${API_URL}/intervalo`, {
          params: {
            initial_date: '20-01-2005',
            final_date: null,
          },
        });
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(400);
        expect(response.data.message).toEqual(
          'Intervalo de datas inválido, informe um intervalo correto'
        );
      }
    });

    test('should return error when final_date is before initial_date', async () => {
      try {
        await axios.get(`${API_URL}/intervalo`, {
          params: {
            initial_date: '20/01/2005',
            final_date: '19/01/2005',
          },
        });
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(400);
        expect(response.data.message).toEqual(
          'Intervalo de datas inválido, informe um intervalo correto'
        );
      }
    });

    test('should return error when initial_date is after final_date', async () => {
      try {
        await axios.get(`${API_URL}/intervalo`, {
          params: {
            initial_date: '22-01-2005',
            final_date: '19-01-2005',
          },
        });
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(400);
        expect(response.data.message).toEqual(
          'Intervalo de datas inválido, informe um intervalo correto'
        );
      }
    });
  });
});

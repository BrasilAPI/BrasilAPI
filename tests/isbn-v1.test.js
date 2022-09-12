const axios = require('axios');

const requestUrl = `${global.SERVER_URL}/api/isbn/v1`;

describe('api/isbn/v1 (E2E)', () => {
  test('Utilizando um ISBN válido existente: 9788545702870', async () => {
    const response = await axios.get(`${requestUrl}/9788545702870`);
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(data).toEqual(
      expect.objectContaining({
        isbn: '9788545702870',
        title: expect.stringContaining('Akira'),
      })
    );
  });

  test('Utilizando um ISBN inválido: 9788491734444', async () => {
    try {
      await axios.get(`${requestUrl}/9788491734444`);
    } catch (error) {
      const { response } = error;
      const { data, status } = response;

      expect(status).toEqual(400);
      expect(data).toEqual({
        message: 'ISBN inválido',
        name: 'BadRequestError',
        type: 'bad_request',
      });
    }
  });

  test('Utilizando provider cbl', async () => {
    const response = await axios.get(
      `${requestUrl}/9788545702870?providers=cbl`
    );
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(data).toEqual(
      expect.objectContaining({
        isbn: '9788545702870',
        title: expect.stringContaining('Akira'),
        publisher: 'Japorama Editora e Comunicação',
        provider: 'CBL',
      })
    );
  });

  test('Utilizando provider mercado-editorial', async () => {
    const response = await axios.get(
      `${requestUrl}/9786555140576?providers=mercado-editorial`
    );
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(data).toEqual(
      expect.objectContaining({
        isbn: '9786555140576',
        title: expect.stringContaining('Uzumaki'),
        publisher: expect.stringContaining('Devir'),
        provider: 'MERCADO_EDITORIAL',
      })
    );
  });

  test('Utilizando provider open-library', async () => {
    const response = await axios.get(
      `${requestUrl}/9788545702870?providers=open-library`
    );
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(data).toEqual(
      expect.objectContaining({
        isbn: '9788545702870',
        title: expect.stringContaining('Akira'),
        publisher: expect.stringContaining('JBC'),
        provider: 'OPEN_LIBRARY',
      })
    );
  });

  test('Utilizando provider google-books', async () => {
    const response = await axios.get(
      `${requestUrl}/9788545712466?providers=google-books`
    );
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(data).toEqual(
      expect.objectContaining({
        isbn: '9788545712466',
        title: expect.stringContaining('Punpun'),
        publisher: expect.stringContaining('JBC'),
        provider: 'GOOGLE_BOOKS',
      })
    );
  });
});

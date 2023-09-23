const axios = require('axios');

describe('pep v1 (E2E)', () => {
  describe('GET /pep/v1?cpf=976.074', () => {
    test('Utilizando um cpf válido: 976.074', async () => {
      const requestUrl = `${global.SERVER_URL}/api/peps/v1?cpf=976.074`;
      const response = await axios.get(requestUrl);
      expect(response.status).toBe(200);
      expect(response.data.data[0].CPF).toBe('***.976.074-**');
      expect(response.data.data[0].Nome_PEP).toBe(
        'ABIDENE SALUSTIANO DA SILVA'
      );
      expect(response.data.data[0].Sigla_Função).toBe('VEREAD');
      expect(response.data.data[0].Descrição_Função).toBe('VEREADOR');
      expect(response.data.data[0].Nível_Função).toBe('');
      expect(response.data.data[0].Nome_Cargo).toBe('MUN. DE PARNAMIRIM-RN');
      expect(response.data.data[0].Data_Início_Exercício).toBe('01/01/2017');
      expect(response.data.data[0].Data_Fim_Exercício).toBe('31/12/2020');
      expect(response.data.data[0].Data_Fim_Carência).toBe('31/12/2025');
      expect(response.data.updated_at).toBe('1688180400');
    });

    test('Utilizando uma data como parâmetro: 31/12/2024', async () => {
      const requestUrl = `${global.SERVER_URL}/api/peps/v1?Data_Fim_Exercício=31/12/2024`;
      const response = await axios.get(requestUrl);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty(
        'data',
        expect.arrayContaining([expect.anything()])
      );
      expect(response.data.updated_at).toBe('1688180400');
    });

    test('Utilizando um cpf inexistente: 550.098', async () => {
      const requestUrl = `${global.SERVER_URL}/api/peps/v1?cpf=550.098`;
      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'Nenhum resultado encontrado',
          type: 'not_found',
          name: 'PEP_NOT_EXISTS',
        });
      }
    });

    test('Nenhum parâmetro de pesquisa', async () => {
      const requestUrl = `${global.SERVER_URL}/api/peps/v1`;
      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message: 'Nenhuma chave de pesquisa digitada',
          type: 'key_not_found',
          name: 'KEY_NOT_FOUND',
        });
      }
    });
  });

  // describe('GET /ncm/v1?search=:description', () => {
  //   test('Utilizando uma descrição válida: Xampus', async () => {
  //     const requestUrl = `${global.SERVER_URL}/api/ncm/v1?search=Xampus`;
  //     const response = await axios.get(requestUrl);
  //     expect(response.status).toBe(200);
  //     expect(response.data).toEqual(
  //       expect.arrayContaining([validOutputSchema])
  //     );

  //     const firstRow = response.data[0];

  //     expect(firstRow.codigo).toBe('3305.10.00');
  //     expect(firstRow.descricao).toContain('Xampus');
  //     expect(firstRow.data_inicio).toBe('2022-04-01');
  //     expect(firstRow.ano_ato).toBe('2021');
  //   });

  //   test('Utilizando uma descrição inexistente: localhost', async () => {
  //     const requestUrl = `${global.SERVER_URL}/api/ncm/v1?search=localhost`;
  //     try {
  //       await axios.get(requestUrl);
  //     } catch (error) {
  //       const { response } = error;

  //       expect(response.status).toBe(404);
  //       expect(response.data).toMatchObject([]);
  //     }
  //   });
  //   test('Utilizando um código válido: 330410', async () => {
  //     const requestUrl = `${global.SERVER_URL}/api/ncm/v1?search=330410`;
  //     const response = await axios.get(requestUrl);
  //     expect(response.status).toBe(200);

  //     expect(response.data).toEqual(
  //       expect.arrayContaining([validOutputSchema])
  //     );
  //     const firstRow = response.data[0];

  //     expect(firstRow.codigo).toBe('3304.10.00');
  //     expect(firstRow.descricao).toContain('maquiagem para os lábios');
  //     expect(firstRow.data_inicio).toBe('2022-04-01');
  //     expect(firstRow.ano_ato).toBe('2021');
  //   });

  //   test('Utilizando um código inexistente: 00', async () => {
  //     const requestUrl = `${global.SERVER_URL}/api/ncm/v1?search=00`;

  //     try {
  //       await axios.get(requestUrl);
  //     } catch (error) {
  //       const { response } = error;

  //       expect(response.status).toBe(404);
  //       expect(response.data).toMatchObject([]);
  //     }
  //   });
  // });

  // test('GET /ncm/v1', async () => {
  //   const requestUrl = `${global.SERVER_URL}/api/ncm/v1`;
  //   const response = await axios.get(requestUrl);
  //   expect(response.status).toBe(200);
  //   expect(Array.isArray(response.data)).toBe(true);
  // });
});

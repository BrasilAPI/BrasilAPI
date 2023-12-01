const { requestHtmlCorreios } = require('../services/correios-restricao/index');
const axios = require('axios');
jest.mock('axios');

describe('api/correiosres/v1', () => {
    it('CEP válido', async () => {

        axios.post.mockResolvedValue({ data: 'mocked response' });

        const cepOrigem = '12345678';
        const cepDestino = '87654321';
        const servico = '04510';

        const result = await requestHtmlCorreios(cepOrigem, cepDestino, servico);

        expect(axios.post).toHaveBeenCalled();
        expect(result).toBe('mocked response');
    });

    it('CEP inválido', async () => {
        axios.post.mockRejectedValue(new Error('Network error'));

        await expect(requestHtmlCorreios('12345678', '87654321', '04510')).rejects.toThrow('Network error');
    });
});


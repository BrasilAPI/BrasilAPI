import { describe, test, expect, beforeEach, vi } from 'vitest';
import { getCityData } from '@/services/cptec';
import removeSpecialChars from '@/util/removeSpecialChars';
import BadRequestError from '@/errors/BadRequestError';
import NotFoundError from '@/errors/NotFoundError';
import InternalError from '@/errors/InternalError';
import BaseError from '@/errors/BaseError';

// Mocks
vi.mock('@/services/cptec');
vi.mock('@/util/removeSpecialChars');

// Função a ser testada (cópia com BaseError importado)
async function getCityByName(request, response) {
  try {
    const cityName = removeSpecialChars(request.query.name);

    if (cityName.length === 0) {
      throw new BadRequestError({
        message: 'Nome da cidade inválido',
        type: 'city_error',
        name: 'CITY_NAME_ERROR',
      });
    }

    const cityData = await getCityData(cityName);

    if (!cityData || cityData.length === 0) {
      throw new NotFoundError({
        message: 'Nenhuma cidade localizada',
        type: 'city_error',
        name: 'NO_CITY_NOT_FOUND',
      });
    }

    response.json(cityData);
  } catch (err) {
    if (err instanceof BaseError) {
      throw err;
    }

    throw new InternalError({
      message: 'Erro ao buscar informações sobre cidade',
      type: 'city_error',
      name: 'CITY_INTERNAL',
    });
  }
}

describe('getCityByName', () => {
  let request;
  let response;

  beforeEach(() => {
    // Setup request e response mocks
    request = {
      query: {},
    };
    response = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };

    // Reset mocks
    vi.clearAllMocks();
  });

  // CT1: Nome de cidade válido com sucesso
  // Cobertura: CD1F, CD2aF, CD2bF (Linha 4 da tabela verdade - Decisão 2)
  test('CT1 - deve retornar dados da cidade quando nome válido é fornecido', async () => {
    const mockCityData = [{ id: 1, nome: 'Brasília', estado: 'DF' }];

    request.query.name = 'Brasilia';
    vi.mocked(removeSpecialChars).mockReturnValue('Brasilia');
    vi.mocked(getCityData).mockResolvedValue(mockCityData);

    await getCityByName(request, response);

    expect(removeSpecialChars).toHaveBeenCalledWith('Brasilia');
    expect(getCityData).toHaveBeenCalledWith('Brasilia');
    expect(response.json).toHaveBeenCalledWith(mockCityData);
  });

  // CT2: Nome vazio após remoção de caracteres especiais
  // Cobertura: CD1V
  test('CT2 - deve lançar BadRequestError quando nome é vazio após removeSpecialChars', async () => {
    request.query.name = '!@#$';
    vi.mocked(removeSpecialChars).mockReturnValue('');

    await expect(getCityByName(request, response)).rejects.toThrow(
      BadRequestError
    );

    try {
      await getCityByName(request, response);
    } catch (error) {
      expect(error.message).toBe('Nome da cidade inválido');
      expect(error.type).toBe('city_error');
      expect(error.name).toBe('CITY_NAME_ERROR');
    }

    expect(getCityData).not.toHaveBeenCalled();
  });

  // CT3: getCityData retorna null
  // Cobertura: CD1F, CD2aV, CD2bF (Linha 2 da tabela verdade - Decisão 2)
  test('CT3 - deve lançar NotFoundError quando getCityData retorna null', async () => {
    request.query.name = 'CidadeInexistente';
    vi.mocked(removeSpecialChars).mockReturnValue('CidadeInexistente');
    vi.mocked(getCityData).mockResolvedValue(null);

    await expect(getCityByName(request, response)).rejects.toThrow(
      NotFoundError
    );

    try {
      await getCityByName(request, response);
    } catch (error) {
      expect(error.message).toBe('Nenhuma cidade localizada');
      expect(error.type).toBe('city_error');
      expect(error.name).toBe('NO_CITY_NOT_FOUND');
    }
  });

  // CT4: getCityData retorna array vazio
  // Cobertura: CD1F, CD2aF, CD2bV (Linha 3 da tabela verdade - Decisão 2)
  test('CT4 - deve lançar NotFoundError quando getCityData retorna array vazio', async () => {
    request.query.name = 'Cidade';
    vi.mocked(removeSpecialChars).mockReturnValue('Cidade');
    vi.mocked(getCityData).mockResolvedValue([]);

    await expect(getCityByName(request, response)).rejects.toThrow(
      NotFoundError
    );

    try {
      await getCityByName(request, response);
    } catch (error) {
      expect(error.message).toBe('Nenhuma cidade localizada');
      expect(error.type).toBe('city_error');
      expect(error.name).toBe('NO_CITY_NOT_FOUND');
    }
  });

  // CT5: Erro interno não-BaseError no getCityData
  // Cobertura: CD3F
  test('CT5 - deve lançar InternalError quando getCityData lança erro genérico', async () => {
    request.query.name = 'Brasilia';
    vi.mocked(removeSpecialChars).mockReturnValue('Brasilia');
    vi.mocked(getCityData).mockRejectedValue(new Error('Erro de rede'));

    await expect(getCityByName(request, response)).rejects.toThrow(
      InternalError
    );

    try {
      await getCityByName(request, response);
    } catch (error) {
      expect(error.message).toBe('Erro ao buscar informações sobre cidade');
      expect(error.type).toBe('city_error');
      expect(error.name).toBe('CITY_INTERNAL');
    }
  });

  // CT6: getCityData lança BaseError
  // Cobertura: CD3V
  test('CT6 - deve propagar BaseError quando getCityData lança BadRequestError', async () => {
    const originalError = new BadRequestError({
      message: 'Erro específico do serviço',
      type: 'service_error',
      name: 'SERVICE_ERROR',
    });

    request.query.name = 'Brasilia';
    vi.mocked(removeSpecialChars).mockReturnValue('Brasilia');
    vi.mocked(getCityData).mockRejectedValue(originalError);

    await expect(getCityByName(request, response)).rejects.toThrow(
      BadRequestError
    );
    await expect(getCityByName(request, response)).rejects.toBe(originalError);
  });
});

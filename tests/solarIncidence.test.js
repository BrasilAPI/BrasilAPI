import { describe, expect, test, vi } from 'vitest';
import axios from 'axios';
import { getSolarIncidence } from '@/services/solarIncidenceService';

vi.mock('axios');

describe('solarIncidenceService', () => {
  test('should fetch solar incidence data', async () => {
    const mockGeocode = {
      results: [{ latitude: -23.5475, longitude: -46.6361 }], // São Paulo
    };
    const mockSolarData = {
      results: {
        sunrise: '2023-07-13T09:21:00+00:00',
        sunset: '2023-07-13T20:18:00+00:00',
        solar_noon: '2023-07-13T14:49:00+00:00',
        day_length: '10:57:00',
      },
    };

    axios.get
      .mockResolvedValueOnce({ data: mockGeocode })
      .mockResolvedValueOnce({ data: mockSolarData });

    const data = await getSolarIncidence('sao_paulo');

    expect(data).toHaveProperty('sunrise');
    expect(data).toHaveProperty('sunset');
    expect(data).toHaveProperty('solar_noon');
    expect(data).toHaveProperty('day_length');
  });

  test('should throw when location is not found', async () => {
    axios.get.mockResolvedValueOnce({ data: { results: [] } });

    await expect(getSolarIncidence('local_inexistente')).rejects.toThrow(
      'Localização não encontrada'
    );
  });
});

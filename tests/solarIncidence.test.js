import { getSolarIncidence } from '../src/services/solarIncidenceService';
import axios from 'axios';

jest.mock('axios');

test('should fetch solar incidence data', async () => {
  const mockCoordinates = { lat: '-23.5505', lon: '-46.6333' }; // Coordenadas de São Paulo
  const mockSolarData = {
    results: {
      sunrise: '2023-07-13T09:21:00+00:00',
      sunset: '2023-07-13T20:18:00+00:00',
      solar_noon: '2023-07-13T14:49:00+00:00',
      day_length: '10:57:00',
      civil_twilight_begin: '2023-07-13T08:58:00+00:00',
      civil_twilight_end: '2023-07-13T20:41:00+00:00',
    }
  };

  axios.get
    .mockResolvedValueOnce({ data: [mockCoordinates] })
    .mockResolvedValueOnce({ data: mockSolarData });

  const data = await getSolarIncidence('sao_paulo');
  expect(data).toHaveProperty('sunrise');
  expect(data).toHaveProperty('sunset');
  expect(data).toHaveProperty('solar_noon');
  expect(data).toHaveProperty('day_length');
});

test('should handle error', async () => {
  axios.get.mockRejectedValue(new Error('Could not fetch data'));

  try {
    await getSolarIncidence('sao_paulo');
  } catch (error) {
    expect(error.message).toBe('Could not fetch data');
  }
});

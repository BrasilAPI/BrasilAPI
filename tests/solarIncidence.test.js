import { getSolarIncidence } from '../src/services/solarIncidenceService';

test('should fetch solar incidence data', async () => {
  const data = await getSolarIncidence('sao_paulo');
  expect(data).toHaveProperty('incidence');
});

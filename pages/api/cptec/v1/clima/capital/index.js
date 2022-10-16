import app from '@/app';

import { getCurrentCapitalWeatherData } from '@/services/cptec';

const action = async (request, response) => {
  const allCurrentConditionData = await getCurrentCapitalWeatherData();

  response.status(200);
  response.json(allCurrentConditionData);
};

export default app().get(action);

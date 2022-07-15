import app from "@/app";
import { getCNAEClasses } from '@/services/ibge/cnae';

const action = async (_, response) => {
  const { data, status } = await getCNAEClasses();

  response.status(status);
  return response.json(data);
};

export default app().get(action);

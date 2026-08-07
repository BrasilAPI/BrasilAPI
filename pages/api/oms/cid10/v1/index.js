import app from '@/app';
import { getAll } from '@/services/oms/cid10';

const action = async (_, response) => {
  const data = getAll();
  return response.status(200).json(data);
};

export default app().get(action);

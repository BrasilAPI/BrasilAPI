import app from '@/app';
import { getCnaeCodeList } from '@/services/cnae-code/v1';

const action = (request, response) => {
  const cnaeCodeList = getCnaeCodeList();
  response.status(200);
  response.json(cnaeCodeList);
};

export default app().get(action);

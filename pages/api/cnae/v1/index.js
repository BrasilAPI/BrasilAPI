import app from '@/app';
import { getCnaeCodeList } from '@/services/cnae-code';

const action = (request, response) => {
  const cnaeCodeList = getCnaeCodeList();
  response.status(200);
  response.json(cnaeCodeList);
};

export default app().get(action);

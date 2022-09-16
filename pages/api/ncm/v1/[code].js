import app from '@/app';
import { getNcmData } from '@/services/sefaz';

const action = async (request, response) => {
  const { code } = request.query;
  const ncmCode = code.replace(/\D/g, '');
  const allNcmData = await getNcmData();
  const ncmData = allNcmData.find(
    ({ codigo }) => codigo.replace(/\D/g, '') === ncmCode
  );

  if (!ncmData) {
    response.status(404);
    response.json({
      message: 'Código NCM não encontrado',
      type: 'NCM_CODE_NOT_FOUND',
    });

    return;
  }

  response.status(200);
  response.json(ncmData);
};

export default app().get(action);

import app from '@/app';
import NotFoundError from '@/errors/NotFoundError';
import { getNcmData } from '@/services/sefaz';

async function getNcmByCode(request, response) {
  const { code } = request.query;
  const ncmCode = code.replace(/\D/g, '');
  const allNcmData = await getNcmData();
  const ncmData = allNcmData.find(
    ({ codigo }) => codigo.replace(/\D/g, '') === ncmCode
  );

  if (!ncmData) {
    throw new NotFoundError({
      message: 'Código NCM não encontrado',
      type: 'NCM_CODE_NOT_FOUND',
    });
  }

  return response.status(200).json(ncmData);
}

export default app().get(getNcmByCode);

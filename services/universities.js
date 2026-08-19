import InternalError from '@/errors/InternalError';
import universities from './universities/snapshots/latest.json';

/**
 * O provider original `api.universities.com.br` (que servia o shape com
 * endereço, IBGE e telefone) saiu do ar de forma permanente — o domínio
 * não resolve mais (NXDOMAIN), sem snapshot em arquivo web.
 *
 * A fonte passou a ser o **Censo da Educação Superior (INEP/MEC)**,
 * pública e gratuita, versionada em `services/universities/snapshots/latest.json`
 * já no formato de resposta da rota.
 *
 * O telefone não consta no cadastro do INEP → `phone: null` (campo
 * compatível retroativo, opcional na doc).
 */
const EMPTY_LIST_ERROR = new InternalError({
  status: 500,
  message: 'Erro ao obter as informações das universidades',
  name: 'UNIVERSITIES_LIST_ERROR',
  type: 'UNIVERSITIES_LIST_ERROR',
});

export const getUniversities = () => {
  if (!Array.isArray(universities) || universities.length === 0) {
    throw EMPTY_LIST_ERROR;
  }

  return universities;
};

export const getUniversitiesById = (id) => {
  const list = getUniversities();

  const university = list.find((item) => Number(item.id) === Number(id));

  return university || null;
};

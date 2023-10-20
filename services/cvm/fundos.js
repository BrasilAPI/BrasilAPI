import BadRequestError from '@/errors/BadRequestError';
import NotFoundError from '@/errors/NotFoundError';
import axios from 'axios';
import { isNaN } from 'lodash';
import Papa from 'papaparse';

const changeHeader = (header) => {
  const headerEnum = {
    TP_FUNDO: 'tipoFundo',
    CNPJ_FUNDO: 'cnpj',
    DENOM_SOCIAL: 'denominacaoSocial',
    DT_REG: 'dataRegistro',
    DT_CONST: 'dataConstituicao',
    CD_CVM: 'codigoCvm',
    DT_CANCEL: 'dataCancelamento',
    SIT: 'situacao',
    DT_INI_SIT: 'dataInicioSituacao',
    DT_INI_ATIV: 'dataInicioAtividade',
    DT_INI_EXERC: 'dataInicioExercicio',
    DT_FIM_EXERC: 'dataFimExercicio',
    CLASSE: 'classe',
    DT_INI_CLASSE: 'dataInicioClasse',
    RENTAB_FUNDO: 'rentabilidade',
    CONDOM: 'condominio',
    FUNDO_COTAS: 'cotas',
    FUNDO_EXCLUSIVO: 'fundoExclusivo',
    TRIB_LPRAZO: 'tributacaoLongoPrazo',
    PUBLICO_ALVO: 'publicoAlvo',
    ENTID_INVEST: 'entidadeInvestimento',
    TAXA_PERFM: 'taxaPerformance',
    INF_TAXA_PERFM: 'informacaoTaxaPerformance',
    TAXA_ADM: 'taxaAdministracao',
    INF_TAXA_ADM: 'informacaoTaxaAdministracao',
    VL_PATRIM_LIQ: 'valorPatrimonioLiquido',
    DT_PATRIM_LIQ: 'dataPatrimonioLiquido',
    DIRETOR: 'diretor',
    CNPJ_ADMIN: 'cnpjAdministrador',
    ADMIN: 'administrador',
    PF_PJ_GESTOR: 'tipoPessoaGestor',
    CPF_CNPJ_GESTOR: 'cpfCnpjGestor',
    GESTOR: 'gestor',
    CNPJ_AUDITOR: 'cnpjAuditor',
    AUDITOR: 'auditor',
    CNPJ_CUSTODIANTE: 'cnpjCustodiante',
    CUSTODIANTE: 'custodiante',
    CNPJ_CONTROLADOR: 'cnpjControlador',
    CONTROLADOR: 'controlador',
    INVEST_CEMPR_EXTER: 'investimentoExterno',
    CLASSE_ANBIMA: 'classeAnbima',
  };
  return headerEnum[header];
};

const fetchCvmData = async () => {
  const response = await axios.get(
    'https://dados.cvm.gov.br/dados/FI/CAD/DADOS/cad_fi.csv',
    { timeout: 3000, responseType: 'arraybuffer' }
  );

  const string = response.data.toString('latin1');

  return string;
};

const parseCvmData = (data, opts = {}) => {
  const parsedData = Papa.parse(data, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => changeHeader(header),
    transform: (value) => value || null,
  });

  if (opts.summary) {
    return parsedData.data.map(
      ({ cnpj, denominacaoSocial, tipoFundo, codigoCvm, situacao }) => ({
        cnpj,
        denominacaoSocial,
        codigoCvm,
        tipoFundo,
        situacao,
      })
    );
  }

  return parsedData.data;
};

export const getFunds = async (size = 100, page = 1) => {
  const offset = Number(page);
  const pageSize = Number(size) > 200 ? 200 : Number(size);

  if (isNaN(offset) || isNaN(size))
    throw new BadRequestError({
      message: 'Página e tamanho devem ser números inteiros',
    });

  const fundData = await fetchCvmData();

  const parsedData = parseCvmData(fundData, { summary: true });

  return {
    data: parsedData.slice((offset - 1) * pageSize, offset * pageSize),
    page: offset,
    size: pageSize,
  };
};

export const getFundDetails = async (cnpj) => {
  const fundData = await fetchCvmData();

  const parsedData = parseCvmData(fundData);

  const fundDetails = parsedData.find(
    (f) => f.cnpj.replace(/\D/gim, '') === cnpj
  );

  if (!fundDetails)
    throw new NotFoundError({ message: 'Fundo não encontrado' });

  return fundDetails;
};

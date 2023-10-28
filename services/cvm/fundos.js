import BadRequestError from '@/errors/BadRequestError';
import NotFoundError from '@/errors/NotFoundError';
import axios from 'axios';
import { isNaN } from 'lodash';
import Papa from 'papaparse';

const changeHeader = (header) => {
  const headerEnum = {
    TP_FUNDO: 'tipo_fundo',
    CNPJ_FUNDO: 'cnpj',
    DENOM_SOCIAL: 'denominacao_social',
    DT_REG: 'data_registro',
    DT_CONST: 'data_constituicao',
    CD_CVM: 'codigo_cvm',
    DT_CANCEL: 'data_cancelamento',
    SIT: 'situacao',
    DT_INI_SIT: 'data_inicio_situacao',
    DT_INI_ATIV: 'data_inicio_atividade',
    DT_INI_EXERC: 'data_inicio_exercicio',
    DT_FIM_EXERC: 'data_fim_exercicio',
    CLASSE: 'classe',
    DT_INI_CLASSE: 'data_inicio_classe',
    RENTAB_FUNDO: 'rentabilidade',
    CONDOM: 'condominio',
    FUNDO_COTAS: 'cotas',
    FUNDO_EXCLUSIVO: 'fundo_exclusivo',
    TRIB_LPRAZO: 'tributacao_longo_prazo',
    PUBLICO_ALVO: 'publico_alvo',
    ENTID_INVEST: 'entidade_investimento',
    TAXA_PERFM: 'taxa_performance',
    INF_TAXA_PERFM: 'informacao_taxa_performance',
    TAXA_ADM: 'taxa_administracao',
    INF_TAXA_ADM: 'informacao_taxa_administracao',
    VL_PATRIM_LIQ: 'valor_patrimonio_liquido',
    DT_PATRIM_LIQ: 'data_patrimonio_liquido',
    DIRETOR: 'diretor',
    CNPJ_ADMIN: 'cnpj_administrador',
    ADMIN: 'administrador',
    PF_PJ_GESTOR: 'tipo_pessoa_gestor',
    CPF_CNPJ_GESTOR: 'cpf_cnpj_gestor',
    GESTOR: 'gestor',
    CNPJ_AUDITOR: 'cnpj_auditor',
    AUDITOR: 'auditor',
    CNPJ_CUSTODIANTE: 'cnpj_custodiante',
    CUSTODIANTE: 'custodiante',
    CNPJ_CONTROLADOR: 'cnpj_controlador',
    CONTROLADOR: 'controlador',
    INVEST_CEMPR_EXTER: 'investimento_externo',
    CLASSE_ANBIMA: 'classe_anbima',
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
      ({
        cnpj,
        denominacao_social: denominacaoSocial,
        tipo_fundo: tipoFundo,
        codigo_cvm: codigoCvm,
        situacao,
      }) => ({
        cnpj,
        denominacao_social: denominacaoSocial,
        codigo_cvm: codigoCvm,
        tipo_fundo: tipoFundo,
        situacao,
      })
    );
  }

  return parsedData.data;
};

export const getFunds = async (size = 100, page = 1) => {
  const offset = Number(page);

  if (Number(size) > 200) {
    throw new BadRequestError({
      message: 'Tamanho máximo da página é de 200 registros',
    });
  }

  const pageSize = Number(size);

  if (isNaN(offset) || isNaN(pageSize))
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

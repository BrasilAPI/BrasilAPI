import app from '@/app';
import fetch from 'node-fetch';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import cboData from '@/services/cbo/cboData.json';

async function Cpf(req, res) {
  const { cpf } = req.query;

  if (!cpf || cpf.length !== 11) {
    return res.status(400).json({ error: 'CPF inválido' });
  }

  try {
    const response = await fetch(
      `https://api.centralda20.com/consultar/${cpf}`
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: 'Erro ao consultar CPF' });
    }

    const data = await response.json();

    if (!data || data.error || response.status === 404) {
      return res.status(404).json({ error: 'CPF não encontrado' });
    }

    let formattedDate;
    try {
      formattedDate = data.NASC
        ? format(new Date(data.NASC), 'dd/MM/yyyy', { locale: ptBR })
        : null;
    } catch (error) {
      formattedDate = null;
    }

    let formattedCadastralDate;
    try {
      formattedCadastralDate = data.DT_SIT_CAD
        ? format(new Date(data.DT_SIT_CAD), 'dd/MM/yyyy', { locale: ptBR })
        : null;
    } catch (error) {
      formattedCadastralDate = null;
    }

    const sexoMap = {
      M: 'Masculino',
      F: 'Feminino',
      I: 'Indefinido',
    };
    const sexo = sexoMap[data.SEXO] || 'Indefinido';

    const cboEntry = cboData.find(
      (entry) => entry.code === String(data.CBO).padStart(6, '0')
    );
    const cboInfo = cboEntry
      ? `${cboEntry.code} - ${cboEntry.name}`
      : `${data.CBO} - Não encontrado`;

    const formattedData = {
      cpf: data.CPF,
      nome: data.NOME,
      sexo,
      nascimento: formattedDate,
      nome_mae: data.NOME_MAE,
      nome_pai: data.NOME_PAI || 'Não informado', // Campo opcional
      rg: data.RG || 'Não informado', // Campo opcional
      situacao_cadastral: data.CD_SIT_CAD,
      data_situacao_cadastral: formattedCadastralDate,
      cbo: cboInfo,
      titulo_eleitor: data.TITULO_ELEITOR || 'Não informado', // Campo opcional
      uf_emissao: data.UF_EMISSAO || 'Não informado', // Campo opcional
      renda: data.RENDA || 'Não informado', // Campo opcional
      faixa_renda: data.FAIXA_RENDA_ID || 'Não informado', // Campo opcional
    };

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno ao buscar CPF' }); // Log the error for debugging
  }
}

export default app({ cache: 172800 }).get(Cpf);

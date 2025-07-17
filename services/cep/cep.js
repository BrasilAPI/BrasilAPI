import axios from 'axios';
import cepPromise from 'cep-promise';

const providers = ['correios', 'viacep', 'widenet', 'correios-alt'];

const CEP_LENGTH = 8;
const DEFAULT_TIMEOUT = 3 * 1000;

function onlyDigits(cep) {
  return cep.replace(/\D/g, '');
}

function isValidCep(cep) {
  const cleanCep = onlyDigits(cep);
  return cleanCep.length === CEP_LENGTH;
}

function extractIbgeInfo(ibge) {
  const code = String(ibge || '');
  const state = code.slice(0, 2) || null;
  return { code, state };
}

async function fetchOpenCep(cep) {
  const { data } = await axios.get(`https://opencep.com/v1/${cep}`, {
    timeout: DEFAULT_TIMEOUT,
  });

  const { code, state } = extractIbgeInfo(data.ibge);

  return {
    cep: onlyDigits(data.cep),
    state: data.uf,
    city: data.localidade,
    neighborhood: data.bairro,
    street: data.logradouro,
    service: 'open-cep',
    ibge: {
      code,
      state,
    },
  };
}

async function updateOpenCep(cep) {
  await axios.get(`https://update.opencep.com/${cep}`, {
    timeout: DEFAULT_TIMEOUT,
  });
}

class CepPromiseError extends Error {
  constructor({ message, type, errors } = {}) {
    super();

    this.name = 'CepPromiseError';
    this.message = message;
    this.type = type;
    this.errors = errors;
  }
}

export async function fetchCep(cep) {
  if (!isValidCep(cep)) {
    throw new CepPromiseError({
      message: `CEP deve conter exatamente ${CEP_LENGTH} caracteres.`,
      type: 'validation_error',
      errors: [
        {
          message: `CEP informado possui mais do que ${CEP_LENGTH} caracteres.`,
          service: 'cep_validation',
        },
      ],
    });
  }

  const cleanCep = onlyDigits(cep);

  const fetchCepPromise = () =>
    cepPromise(cleanCep, {
      providers,
    });

  return fetchOpenCep(cleanCep).catch(() =>
    fetchCepPromise().then(async (data) => {
      await updateOpenCep(cleanCep).catch(() => {});
      return data;
    })
  );
}

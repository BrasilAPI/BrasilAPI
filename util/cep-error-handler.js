const ERROR_PATTERNS = {
  viacep: {
    patterns: ['Cannot read properties', 'undefined', 'reading', 'null'],
    standardMessage: 'CEP não encontrado na base do ViaCEP.',
  },
  correios: {
    patterns: ['autenticacao', 'null falhou', 'falhou', 'Authentication'],
    standardMessage: 'CEP INVÁLIDO',
  },
  widenet: {
    patterns: ['Erro ao se conectar', 'conectar com o serviço', 'connection'],
    standardMessage: 'CEP não encontrado',
  },
};

function containsTechnicalError(message, patterns) {
  return patterns.some((pattern) =>
    message.toLowerCase().includes(pattern.toLowerCase())
  );
}

export function normalizeServiceError(error) {
  const errorMessage = error.message || '';
  const service = error.service || '';

  const serviceConfig = ERROR_PATTERNS[service];

  if (serviceConfig) {
    if (containsTechnicalError(errorMessage, serviceConfig.patterns)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[CEP Error Handler] Erro técnico normalizado:`, {
          service,
          originalMessage: errorMessage,
          standardMessage: serviceConfig.standardMessage,
        });
      }

      return {
        ...error,
        message: serviceConfig.standardMessage,
      };
    }
  }

  return error;
}

export function normalizeServiceErrors(errors) {
  if (!Array.isArray(errors)) {
    return errors;
  }

  return errors.map(normalizeServiceError);
}

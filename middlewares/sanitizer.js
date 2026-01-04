import validator from 'validator';

/**
 * Middleware para sanitizar e validar dados de entrada
 * Remove scripts maliciosos, SQL injection, XSS, etc.
 */

// Função para sanitizar strings
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  
  // Remove tags HTML e scripts
  let sanitized = validator.stripLow(str);
  sanitized = validator.escape(sanitized);
  
  // Remove caracteres perigosos para SQL injection
  sanitized = sanitized.replace(/[;'"\\]/g, '');
  
  return validator.trim(sanitized);
};

// Função para sanitizar objetos recursivamente
const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = sanitizeString(key);
      sanitized[sanitizedKey] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  return obj;
};

// Validações específicas para diferentes tipos de dados
const validators = {
  // Valida CEP brasileiro (8 dígitos)
  cep: (value) => {
    const cepClean = value.replace(/\D/g, '');
    return /^\d{8}$/.test(cepClean);
  },
  
  // Valida CNPJ (14 dígitos)
  cnpj: (value) => {
    const cnpjClean = value.replace(/\D/g, '');
    return /^\d{14}$/.test(cnpjClean);
  },
  
  // Valida DDD (2 dígitos)
  ddd: (value) => {
    const dddClean = value.replace(/\D/g, '');
    return /^\d{2}$/.test(dddClean);
  },
  
  // Valida ISBN
  isbn: (value) => {
    return validator.isISBN(value, '10') || validator.isISBN(value, '13');
  },
  
  // Valida data no formato YYYY-MM-DD
  date: (value) => {
    return validator.isISO8601(value);
  },
  
  // Valida números inteiros positivos
  positiveInt: (value) => {
    return validator.isInt(String(value), { min: 0 });
  },
};

// Middleware principal de sanitização
export default function sanitizer(request, response, next) {
  try {
    // Sanitiza query parameters
    if (request.query) {
      request.query = sanitizeObject(request.query);
    }
    
    // Sanitiza body
    if (request.body) {
      request.body = sanitizeObject(request.body);
    }
    
    // Sanitiza params de rota
    if (request.params) {
      request.params = sanitizeObject(request.params);
    }
    
    // Adiciona validadores customizados ao request
    request.validate = (field, type) => {
      const value = request.query[field] || request.params[field] || request.body?.[field];
      
      if (!value) {
        return false;
      }
      
      const validatorFn = validators[type];
      if (!validatorFn) {
        console.warn(`Validador '${type}' não encontrado`);
        return true;
      }
      
      return validatorFn(value);
    };
    
    return next();
  } catch (error) {
    console.error('Erro no middleware de sanitização:', error);
    return next();
  }
}

// Exporta os validadores para uso direto
export { validators, sanitizeString, sanitizeObject };

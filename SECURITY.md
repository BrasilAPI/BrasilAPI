# Segurança da API

## Rate Limiting

O projeto agora possui proteção contra abuso com limite de requisições:

- **Produção**: 100 requisições por minuto por IP
- **Desenvolvimento**: 300 requisições por minuto por IP

### Headers de Rate Limit

Cada resposta inclui headers informativos:
- `RateLimit-Limit`: Total de requisições permitidas
- `RateLimit-Remaining`: Requisições restantes
- `RateLimit-Reset`: Tempo até o reset do contador

### Quando o limite é excedido

```json
{
  "message": "Muitas requisições deste IP. Por favor, tente novamente em alguns instantes.",
  "type": "rate_limit_exceeded",
  "name": "RateLimitError"
}
```

## Sanitização de Dados

Todos os dados de entrada (query params, body, route params) são automaticamente sanitizados:

- ✅ Remove tags HTML e scripts maliciosos
- ✅ Previne SQL Injection
- ✅ Previne XSS (Cross-Site Scripting)
- ✅ Remove caracteres perigosos
- ✅ Validação específica por tipo de dado

### Validadores Disponíveis

Use `request.validate(campo, tipo)` em suas rotas:

```javascript
// Exemplo em uma rota
app.get('/api/cep/:cep', (request, response) => {
  if (!request.validate('cep', 'cep')) {
    return response.status(400).json({
      message: 'CEP inválido',
      type: 'bad_request'
    });
  }
  // ... resto do código
});
```

**Tipos de validação:**
- `cep` - CEP brasileiro (8 dígitos)
- `cnpj` - CNPJ (14 dígitos)
- `ddd` - DDD (2 dígitos)
- `isbn` - ISBN 10 ou 13
- `date` - Data ISO 8601
- `positiveInt` - Número inteiro positivo

## Configuração

### Rate Limit Personalizado

Para ajustar os limites, edite `/middlewares/rateLimit.js`:

```javascript
const limiter = rateLimit({
  windowMs: 60 * 1000, // janela de tempo
  max: 100, // máximo de requisições
  // ...
});
```

### Ignorar Rate Limit

Adicione rotas ao skip:

```javascript
skip: (request) => {
  return request.url === '/api/status' || request.url === '/api/health';
}
```

## Ordem dos Middlewares

1. CORS
2. Firewall (Cloudflare)
3. **Rate Limit** ⬅️ novo
4. **Sanitizer** ⬅️ novo
5. Logger
6. Cache

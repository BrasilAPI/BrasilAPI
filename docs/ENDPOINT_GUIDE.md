# Guia de Criação de Endpoints

## Antes de Começar

Antes de escrever uma linha de código, confirme todos os itens:

- [ ] A fonte de dados é **pública e gratuita**?
- [ ] A API/fonte externa é estável e mantida?
- [ ] Não há necessidade de banco de dados ou storage próprio?
- [ ] Existe documentação pública da fonte de dados?

> ⚠️ **O BrasilAPI é open-source e sem financiamento.** Não temos como arcar com custos de infraestrutura. Nenhum endpoint pode depender de banco de dados próprio, storage ou qualquer serviço pago. Todos os dados devem vir de fontes públicas e gratuitas.

Se algum item acima não puder ser confirmado, abra uma issue antes de implementar para discutir a viabilidade.

---

## Estrutura de Arquivos

Para um endpoint `GET /api/{dominio}/v1/[param]`, crie os seguintes arquivos:

| Arquivo | Responsabilidade |
|---|---|
| `pages/api/{dominio}/v1/[param].js` | Handler: roteamento e resposta HTTP |
| `services/{dominio}.js` | Lógica de negócio e chamadas a APIs externas |
| `tests/{dominio}-v1.test.js` | Testes E2E |
| `pages/docs/doc/{dominio}.json` | Documentação OpenAPI 3.0 |

Para múltiplos sub-serviços, use um diretório: `services/{dominio}/index.js`.

---

## Templates

### Handler — `pages/api/{dominio}/v1/[param].js`

```js
import app from '@/app';
import NotFoundError from '@/errors/NotFoundError';
import { getDominioData } from '@/services/dominio';

async function getDominioById(request, response) {
  const { param } = request.query;
  const data = await getDominioData(param);
  return response.status(200).json(data);
}

export default app().get(getDominioById);
```

**Regras do handler:**
- Use `app()` sempre — ele já inclui cors, cache, logger, firewall e errorHandler
- Lance erros usando as classes de `@/errors/` — o `errorHandler` formata a resposta automaticamente
- Não use `try/catch` genérico — deixe erros inesperados propagarem para o middleware
- Para cache customizado: `app({ cache: 86400 }).get(handler)` (segundos; padrão é 86400)

### Service — `services/{dominio}.js`

```js
import axios from 'axios';
import NotFoundError from '@/errors/NotFoundError';
import BadRequestError from '@/errors/BadRequestError';

export async function getDominioData(param) {
  if (!param || !/^[a-z0-9]+$/i.test(param)) {
    throw new BadRequestError({
      message: 'Parâmetro inválido.',
      type: 'DOMINIO_INVALID_PARAM',
    });
  }

  const { data } = await axios.get(`https://fonte-publica.gov.br/api/${param}`);

  if (!data) {
    throw new NotFoundError({
      message: 'Recurso não encontrado.',
      type: 'DOMINIO_NOT_FOUND',
    });
  }

  return data;
}
```

**Regras do service:**
- Lance erros tipados (`NotFoundError`, `BadRequestError`, `InternalError`) — nunca objetos literais
- Faça transformação/normalização dos dados aqui, não no handler
- Valide o input antes de chamar a API externa

### Teste — `tests/{dominio}-v1.test.js`

```js
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('dominio v1 (E2E)', () => {
  describe('GET /api/dominio/v1/:param', () => {
    test('Verifica CORS', async () => {
      const response = await axios.get(
        `${global.SERVER_URL}/api/dominio/v1/param-valido`
      );
      expect(response.headers['access-control-allow-origin']).toBe('*');
    });

    test('Retorna dados para parâmetro válido', async () => {
      const response = await axios.get(
        `${global.SERVER_URL}/api/dominio/v1/param-valido`
      );
      expect(response.status).toBe(200);
      expect(response.data).toMatchObject({
        campo1: expect.any(String),
        campo2: expect.any(Number),
      });
    });

    test('Retorna 404 para parâmetro inexistente', async () => {
      expect.assertions(2);
      try {
        await axios.get(`${global.SERVER_URL}/api/dominio/v1/param-inexistente-xyz`);
      } catch (error) {
        expect(error.response.status).toBe(404);
        expect(error.response.data).toMatchObject({
          message: expect.any(String),
          type: expect.any(String),
        });
      }
    });

    test('Retorna 400 para parâmetro inválido', async () => {
      expect.assertions(1);
      try {
        await axios.get(`${global.SERVER_URL}/api/dominio/v1/????`);
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });
  });
});
```

**Regras dos testes:**
- Testes são E2E — fazem chamadas HTTP reais contra o servidor local em `global.SERVER_URL`
- `npm test` inicia o servidor e o Vitest automaticamente (via `concurrently`)
- Sempre cubra: CORS, sucesso (200), não encontrado (404), parâmetro inválido (400 — se aplicável)
- Use `expect.assertions(N)` em blocos `try/catch` para garantir que o erro foi lançado

### Documentação OpenAPI — `pages/docs/doc/{dominio}.json`

```json
{
  "tags": [
    {
      "name": "DOMINIO",
      "description": "Descrição do domínio"
    }
  ],
  "paths": {
    "/dominio/v1/{param}": {
      "get": {
        "tags": ["DOMINIO"],
        "summary": "Descrição curta do que este endpoint retorna",
        "description": "",
        "parameters": [
          {
            "name": "param",
            "in": "path",
            "description": "Descrição do parâmetro",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Dominio"
                }
              }
            }
          },
          "404": {
            "description": "Recurso não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorMessage"
                },
                "example": {
                  "message": "Recurso não encontrado",
                  "type": "DOMINIO_NOT_FOUND"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Dominio": {
        "title": "Dominio",
        "required": ["campo1", "campo2"],
        "type": "object",
        "properties": {
          "campo1": {
            "type": "string",
            "description": "Descrição do campo"
          },
          "campo2": {
            "type": "integer",
            "description": "Descrição do campo"
          }
        },
        "example": {
          "campo1": "valor-exemplo",
          "campo2": 123
        }
      }
    }
  }
}
```

**Notas:**
- Use sempre `"$ref": "#/components/schemas/ErrorMessage"` para respostas de erro — este schema já existe globalmente
- Adicione exemplos realistas no campo `"example"`
- Documentação em português

---

## Compatibilidade de API

> ⚠️ **CRÍTICO:** A BrasilAPI é usada por milhares de aplicações em produção. Uma mudança incompatível pode derrubar apps reais de forma silenciosa.

### O que **nunca** pode mudar em endpoints existentes

| Proibido | Como resolver sem quebrar |
|---|---|
| Remover um campo da resposta | Manter o campo (mesmo que `null`) |
| Renomear um campo | Adicionar campo novo com o nome correto, manter o antigo |
| Mudar tipo de um campo (`string` → `number`) | Adicionar campo novo com tipo correto, manter o antigo |
| Alterar a URL do endpoint | Criar nova versão (`/v2/`) |
| Mudar código de status HTTP de respostas de sucesso | Criar nova versão |

### Quando criar uma nova versão (`v2`)

Se a sua mudança se enquadra em qualquer item da tabela acima → crie `/v2`:

1. Novo handler: `pages/api/{dominio}/v2/[param].js`
2. Novos testes: `tests/{dominio}-v2.test.js`
3. Adicionar paths `/dominio/v2/...` na documentação existente (`pages/docs/doc/{dominio}.json`)
4. Manter a v1 funcionando normalmente (não apague, não modifique)

### Mudanças sempre compatíveis ✅

- Adicionar **novos campos** à resposta (clientes que não conhecem o campo simplesmente ignoram)
- Criar novos endpoints
- Adicionar novos parâmetros **opcionais** a endpoints existentes
- Corrigir valores incorretos de campos existentes (desde que o tipo e nome não mudem)

---

## Checklist Final

Antes de abrir o PR, confirme:

- [ ] `npm test` passa sem erros
- [ ] `npm run fix` executado sem erros de lint
- [ ] Handler usa `app()` e lança erros com as classes de `@/errors/`
- [ ] Service não depende de banco de dados, storage ou serviço pago
- [ ] Documentação OpenAPI criada/atualizada em `pages/docs/doc/`
- [ ] Testes cobrem: CORS, sucesso (200), não encontrado (404), parâmetro inválido (400)
- [ ] Endpoints e campos existentes não foram modificados de forma incompatível
- [ ] Commit segue Conventional Commits (`feat:`, `fix:`, `docs:`, etc.)

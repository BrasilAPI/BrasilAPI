# BrasilAPI — CLAUDE.md

Projeto open-source de API pública para dados brasileiros. Usado por milhares de desenvolvedores e empresas em produção.

## Stack

- **Framework:** Next.js 12, API routes em `pages/api/`
- **Testes:** Vitest 3 (E2E, faz chamadas HTTP reais ao servidor local)
- **Lint:** ESLint (Airbnb) + Prettier
- **Commits:** Conventional Commits via `npm run commit`
- **Node:** >=20 <22 | **npm:** >=10

## Comandos

```bash
npm run dev        # servidor Next.js local
npm test           # inicia Next.js + Vitest concorrentemente
npm run fix        # ESLint autofix
npm run commit     # commit interativo (conventional commits)
```

## Arquitetura

### Estrutura de diretórios

```
pages/api/{domínio}/v{n}/[param].js   # handlers (roteamento + resposta)
services/{domínio}/                    # lógica de negócio e chamadas externas
tests/{domínio}-v{n}.test.js           # testes E2E
pages/docs/doc/{domínio}.json          # documentação OpenAPI 3.0
errors/                                # BadRequestError, NotFoundError, etc.
middlewares/                           # cors, cache, logger, errorHandler, firewall
util/                                  # funções utilitárias pequenas
lib/                                   # helpers de suporte
```

Para criar um novo endpoint do zero, use o [Guia de Criação de Endpoints](docs/ENDPOINT_GUIDE.md) — inclui templates prontos para handler, service, teste e OpenAPI.

### Padrão de handler

```js
import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import { myServiceFunction } from '@/services/domain';

async function handler(request, response) {
  const { param } = request.query;
  const data = await myServiceFunction(param);
  return response.status(200).json(data);
}

export default app().get(handler);
```

- `app()` é um wrapper `next-connect` com middlewares já aplicados (cors, cache, logger, firewall, errorHandler)
- Erros devem ser lançados como instâncias das classes em `errors/` — o `errorHandler` formata a resposta
- Não use try/catch genérico no handler; deixe o middleware tratar erros inesperados

### Classes de erro

| Classe | Status |
|---|---|
| `BadRequestError` | 400 |
| `UnauthorizedError` | 401 |
| `NotFoundError` | 404 |
| `InternalError` | 500 |

### Padrão de teste

```js
import { describe, test, expect, beforeAll } from 'vitest';
import axios from 'axios';
import { testCorsForRoute } from '../helpers';

describe('domain v1', () => {
  beforeAll(async () => { /* aguarda servidor */ });

  test('GET /api/domain/v1/[param] com parâmetro válido', async () => {
    const { status, data } = await axios.get(`${global.SERVER_URL}/api/domain/v1/param`);
    expect(status).toBe(200);
    expect(data).toHaveProperty('field');
  });

  test('GET /api/domain/v1/[param] com parâmetro inválido', async () => {
    await expect(axios.get(`${global.SERVER_URL}/api/domain/v1/invalid`))
      .rejects.toMatchObject({ response: { status: 400 } });
  });

  testCorsForRoute('/api/domain/v1/param');
});
```

- Testes fazem chamadas HTTP reais — o servidor precisa estar rodando
- `fileParallelism: false` — testes rodam sequencialmente
- Cobrir: sucesso, erros (400, 404, 500), CORS

## Princípios inegociáveis

### 1. Compatibilidade retroativa é NON-NEGOTIABLE

A BrasilAPI é usada em produção. Nunca:
- Remover ou renomear campos de resposta existentes
- Mudar tipos de dados de campos existentes
- Alterar URLs ou status HTTP de endpoints existentes

Se uma mudança quebra compatibilidade → criar nova versão (`v2`, `v3`).

### 2. Zero custos de infraestrutura

O projeto é open-source e sem financiamento. Isso é uma restrição arquitetural, não apenas de performance:
- Nenhum endpoint pode depender de banco de dados próprio, storage ou serviço pago
- Todos os dados devem vir de fontes públicas e gratuitas
- Serviços que exigem chave de API ou cadastro prévio devem ser discutidos em issue antes de implementar
- Dependências novas devem ser justificadas e leves
- Cache deve ser usado quando possível (middleware `cache` já está disponível via `app()`)

### 3. Documentação obrigatória

Todo endpoint novo ou modificado precisa de documentação OpenAPI em `pages/docs/doc/`. Use o schema `ErrorMessage` para respostas de erro.

## Revisão de PRs

Para triagem e revisão de PRs, consulte:
- `.github/CODE_REVIEW_GUIDELINES.md` — critérios detalhados de revisão
- `.github/PULL_REQUEST_TEMPLATE.md` — checklist do autor

### Antes de enviar reviews e comentários

**SEMPRE** verificar se já existe review/comentário similar no PR antes de postar:
- Ler todos os comentários e reviews existentes (`gh pr view <n> --comments`)
- Não duplicar agradecimentos ao contributor
- Não repetir feedback que já foi dado — se o ponto já foi levantado, reforçar com contexto novo ou não comentar

### Fluxo obrigatório para merge de PR externo

**NUNCA** use `gh pr merge` diretamente. Use sempre o script:

```bash
./scripts/merge-pr.sh <pr-number>
```

O script garante, nesta ordem:
1. Validação dos endpoints críticos em produção (`brasilapi.com.br`)
2. Validação no preview Vercel do PR (se disponível)
3. Agradecimento automático ao contributor
4. Merge com squash

Um hook no Claude Code intercepta chamadas diretas a `gh pr merge` como rede de segurança.

### Bloqueiam o merge (não aprovar sem correção)

- Quebra de compatibilidade retroativa sem nova versão
- Endpoint sem documentação OpenAPI
- Testes ausentes para novos endpoints ou mudanças de comportamento, ou testes falhando (`npm test`)
- Secrets, credenciais ou tokens no código
- Dependência de banco de dados próprio, storage, ou serviço pago/que exige chave de API privada
- ESLint com erros (`npm run fix` deve passar sem erros restantes)
- Commit sem seguir Conventional Commits (`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`)

### Sugestões (não bloqueiam, mas vale apontar)

- Performance subótima (ex: chamada externa que poderia ser cacheada)
- Nomes de variáveis/funções pouco descritivos
- Tratamento de edge cases ausente mas não crítico
- Código que poderia ser simplificado

## Path alias

`@` aponta para a raiz do projeto (configurado em `jsconfig.json` / `next.config.js`).

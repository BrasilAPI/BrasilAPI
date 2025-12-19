# Instruções para Desenvolvimento - BrasilAPI

## 🎯 Visão Geral do Projeto

A BrasilAPI é uma iniciativa **100% gratuita e sem custos** que centraliza APIs públicas brasileiras, oferecendo acesso rápido e moderno a dados como CEP, CNPJ, bancos, feriados, IBGE, entre outros. O projeto é hospedado na Vercel com CDN distribuída globalmente.

### Missão Crítica
- **Projeto sem custos**: Todas as soluções devem ser gratuitas e sustentáveis
- **Clientes importantes**: Empresas de grande porte dependem desta API em produção
- **Zero downtime**: Não podemos ter quedas ou indisponibilidades
- **Alta disponibilidade**: Requisito essencial para manter a confiança dos usuários

## ⚠️ Princípios Fundamentais

### 1. Nunca Quebre Contratos de API
- **SEMPRE mantenha compatibilidade retroativa** em endpoints existentes
- Adicione novos campos, mas NUNCA remova ou renomeie campos existentes
- Se precisar mudar a estrutura, crie uma nova versão (v2, v3, etc.)
- Valide com testes E2E antes de fazer merge

### 2. Documentação Sempre Atualizada
- **SEMPRE** atualize a documentação OpenAPI ao modificar endpoints
- Documentação está em `pages/docs/doc/` (formato JSON, OpenAPI 3.0)
- Todo novo endpoint DEVE ter documentação antes do merge
- Mantenha exemplos de requisição/resposta atualizados

### 3. Performance e Custos
- Minimize chamadas a APIs externas (use cache quando possível)
- Evite processamento pesado que aumente custos da Vercel
- Reutilize código e bibliotecas existentes
- Não adicione dependências pesadas desnecessárias

### 4. Qualidade e Confiabilidade
- **SEMPRE** escreva testes E2E para novos endpoints
- Execute `npm test` localmente antes de submeter PR
- Use `npm run fix` para garantir código limpo (ESLint + Prettier)
- Siga os padrões de código existentes no projeto

## 🏗️ Arquitetura do Projeto

### Estrutura de Diretórios
```
/pages/api/        # Endpoints da API (Next.js API Routes)
/services/         # Lógica de negócio e integrações com APIs externas
/tests/            # Testes E2E (Vitest)
/pages/docs/       # Documentação OpenAPI
/components/       # Componentes React para o site
/util/             # Utilitários compartilhados
```

### Padrão de Endpoints
- Endpoints em `/pages/api/[recurso]/[versao]/[...params].js`
- Exemplo: `/pages/api/cep/v1/[cep].js`
- Sempre use versionamento (v1, v2, etc.)
- Use Next.js API Routes com `next-connect` para middleware

### Padrão de Serviços
- Serviços em `/services/[recurso].js`
- Exportam funções assíncronas que fazem integrações
- Tratam erros e retornam dados padronizados
- Não devem ter lógica de HTTP (isso fica nos endpoints)

## 🧪 Testes

### Estrutura de Testes
- Testes E2E usando Vitest em `/tests/`
- Nomeação: `[recurso]-v[versao].test.js`
- Sempre teste CORS (deve retornar `*`)
- Teste casos de sucesso E erro
- Teste validações de entrada

### Comandos
```bash
npm test              # Roda todos os testes
npm run test:watch    # Modo watch
npm run dev           # Servidor local (porta 3000)
```

### Exemplo de Teste E2E
```javascript
describe('/api/recurso/v1 (E2E)', () => {
  test('Verifica CORS', async () => {
    const response = await axios.get(`${global.SERVER_URL}/api/recurso/v1/...`);
    expect(response.headers['access-control-allow-origin']).toBe('*');
  });

  test('Caso de sucesso', async () => {
    const response = await axios.get(`${global.SERVER_URL}/api/recurso/v1/...`);
    expect(response.data).toEqual({
      // estrutura esperada
    });
  });

  test('Caso de erro - recurso não encontrado', async () => {
    try {
      await axios.get(`${global.SERVER_URL}/api/recurso/v1/invalido`);
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });
});
```

## 📝 Padrões de Código

### JavaScript
- Use ES6+ (async/await, destructuring, arrow functions)
- Use ESLint + Prettier (configuração já definida)
- Siga o Airbnb Style Guide (base do projeto)
- Evite comentários óbvios, prefira código auto-explicativo

### Commits
- Use Conventional Commits (execute `npm run commit`)
- Formato: `tipo(escopo): mensagem`
- Tipos: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- Exemplo: `feat(cep): adiciona endpoint v2 com mais detalhes`

### Tratamento de Erros
- Use o schema `ErrorMessage` da documentação OpenAPI
- Retorne status HTTP apropriados (400, 404, 500, 503)
- Mensagens de erro em português, claras e úteis
- Exemplo:
```javascript
return res.status(404).json({
  name: 'NotFoundError',
  message: 'CEP não encontrado',
  type: 'not_found'
});
```

## 🔒 Segurança

- **NUNCA** commite credenciais, tokens ou secrets
- Use variáveis de ambiente para configurações sensíveis
- Valide TODOS os inputs do usuário
- Sanitize dados antes de processar
- Proteja contra injeção e XSS

## 🚀 Workflow de Desenvolvimento

### Criando um Novo Endpoint

1. **Crie o serviço** em `/services/[recurso].js`
   ```javascript
   async function buscarRecurso(id) {
     // lógica de integração
     return dados;
   }
   ```

2. **Crie o endpoint** em `/pages/api/[recurso]/v1/[param].js`
   ```javascript
   import nextConnect from 'next-connect';
   import cors from '@/middlewares/cors';
   import { buscarRecurso } from '@/services/recurso';

   export default nextConnect()
     .use(cors)
     .get(async (req, res) => {
       const { param } = req.query;
       const dados = await buscarRecurso(param);
       return res.json(dados);
     });
   ```

3. **Crie os testes** em `/tests/[recurso]-v1.test.js`

4. **Crie a documentação** em `/pages/docs/doc/[recurso].json`

5. **Execute os testes** localmente
   ```bash
   npm run dev  # em um terminal
   npm test     # em outro terminal
   ```

6. **Valide com ESLint**
   ```bash
   npm run fix
   ```

7. **Faça o commit**
   ```bash
   npm run commit
   ```

## 📚 Recursos Importantes

### Tecnologias Principais
- **Next.js 12**: Framework React/API
- **Vercel**: Hospedagem + CDN
- **Vitest**: Framework de testes
- **ESLint + Prettier**: Qualidade de código
- **OpenAPI 3.0**: Documentação de API

### Links Úteis
- Documentação: https://brasilapi.com.br/docs
- Repositório: https://github.com/BrasilAPI/BrasilAPI
- Issues: https://github.com/BrasilAPI/BrasilAPI/issues

## ❓ Perguntas Frequentes

**Q: Posso remover um campo de uma resposta de API?**
A: NÃO! Isso quebra compatibilidade. Crie uma nova versão se necessário.

**Q: Posso adicionar uma nova dependência npm?**
A: Sim, mas avalie se realmente é necessária. Prefira bibliotecas leves e mantenha custos baixos.

**Q: Como adiciono um novo endpoint?**
A: Siga o workflow acima: serviço → endpoint → testes → documentação → PR.

**Q: Preciso atualizar a documentação?**
A: SIM! SEMPRE. Documentação desatualizada prejudica os usuários.

**Q: Posso mudar a estrutura de um erro?**
A: Use sempre o schema `ErrorMessage` padrão. Não crie formatos novos.

## 🎓 Boas Práticas Específicas

### Ao Trabalhar com APIs Externas
- Sempre trate timeouts e erros de rede
- Use retry logic quando apropriado (não para todas as APIs)
- Cache respostas quando possível (respeitando TTL)
- Não exponha erros internos das APIs upstream

### Ao Trabalhar com Dados Públicos
- Respeite rate limits das fontes de dados
- Valide formato dos dados recebidos
- Normalize dados para um formato consistente
- Documente a fonte original dos dados

### Performance
- Minimize transformações de dados
- Use streams para dados grandes
- Evite processamento síncrono pesado
- Aproveite o cache da Vercel CDN

## ⚡ Comandos Rápidos

```bash
npm install          # Instalar dependências
npm run dev          # Servidor local
npm test             # Rodar testes
npm run fix          # Corrigir estilo de código
npm run commit       # Commit interativo
npm run build        # Build de produção
```

---

**Lembre-se**: Este é um projeto público que serve milhares de desenvolvedores brasileiros. Qualidade, confiabilidade e compatibilidade são essenciais. Cada mudança impacta pessoas reais construindo aplicações reais.

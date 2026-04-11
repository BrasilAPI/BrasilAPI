# Guia de Revisão de Código - BrasilAPI

## 🎯 Objetivo da Revisão

Este guia auxilia revisores a garantir que mudanças no código da BrasilAPI mantenham os mais altos padrões de qualidade, confiabilidade e compatibilidade. A BrasilAPI é usada por milhares de desenvolvedores e empresas importantes, portanto cada mudança deve ser cuidadosamente avaliada.

## ⚠️ Princípios de Revisão

### 1. Zero Tolerância para Quebra de Compatibilidade
A compatibilidade retroativa é **NON-NEGOTIABLE**. Qualquer quebra pode derrubar aplicações em produção.

### 2. Documentação é Obrigatória
Código sem documentação não deve ser mergeado, independente da qualidade técnica.

### 3. Projeto Sem Custos Deve Permanecer Assim
Mudanças que aumentem custos de infraestrutura devem ser recusadas ou otimizadas.

### 4. Segurança em Primeiro Lugar
Vulnerabilidades não são aceitáveis. Melhor recusar o PR do que mergear código inseguro.

## 🔍 Checklist de Revisão Obrigatória

### ✅ 1. Compatibilidade de API (CRÍTICO)

**Verificações Obrigatórias:**

- [ ] Endpoints existentes não foram removidos
- [ ] URLs de endpoints não foram modificadas
- [ ] Campos de resposta não foram removidos
- [ ] Campos de resposta não foram renomeados
- [ ] Tipos de dados de campos não foram alterados
- [ ] Códigos de status HTTP permanecem consistentes
- [ ] Formato de erros segue o padrão `ErrorMessage`
- [ ] Se há mudanças incompatíveis, nova versão foi criada (v2, v3)

**Como Verificar:**
```bash
# Compare respostas da API antes e depois
git diff main -- pages/api/

# Verifique testes E2E para mudanças em contratos
git diff main -- tests/
```

**Perguntas a Fazer:**
- Esta mudança quebra aplicações existentes?
- Um cliente que usa a v1 continuará funcionando após o deploy?
- Novos campos são **adições**, não substituições?

### ✅ 2. Documentação

**Verificações Obrigatórias:**

- [ ] Documentação OpenAPI foi atualizada em `/pages/docs/doc/`
- [ ] Exemplos de requisição/resposta estão corretos e completos
- [ ] Novos endpoints têm documentação completa
- [ ] Mensagens de erro estão documentadas
- [ ] Campos novos têm descrição clara
- [ ] README.md foi atualizado se necessário

**Como Verificar:**
```bash
# Verifique se arquivos de documentação foram modificados
git diff main -- pages/docs/

# Valide JSON da documentação
cat pages/docs/doc/[endpoint].json | jq .
```

**Perguntas a Fazer:**
- A documentação reflete exatamente o comportamento do código?
- Um desenvolvedor conseguiria usar este endpoint apenas lendo a doc?
- Exemplos estão funcionais e realistas?

### ✅ 3. Testes

**Verificações Obrigatórias:**

- [ ] Testes E2E foram criados ou atualizados
- [ ] Teste de CORS está presente e correto
- [ ] Casos de sucesso estão cobertos
- [ ] Casos de erro estão cobertos (404, 400, 500, etc.)
- [ ] Validações de entrada estão testadas
- [ ] Testes passam localmente e no CI

**Como Verificar:**
```bash
# Execute os testes
npm test

# Verifique cobertura de novos endpoints
git diff main -- tests/
```

**Perguntas a Fazer:**
- Os testes garantem que o comportamento esperado é mantido?
- Edge cases foram considerados?
- Testes falhariam se o código estivesse errado?

### ✅ 4. Qualidade de Código

**Verificações Obrigatórias:**

- [ ] Código segue o style guide (ESLint + Prettier)
- [ ] Não há código comentado ou console.logs esquecidos
- [ ] Nomes de variáveis/funções são claros e descritivos
- [ ] Código é DRY (Don't Repeat Yourself)
- [ ] Funções têm responsabilidade única
- [ ] Complexidade é apropriada (não over-engineering)

**Como Verificar:**
```bash
# Execute linting
npm run fix

# Revise diff manualmente
git diff main
```

**Perguntas a Fazer:**
- Este código é fácil de entender?
- Um desenvolvedor novo conseguiria dar manutenção?
- Há duplicação que deveria ser refatorada?

### ✅ 5. Performance e Custos

> ⚠️ O BrasilAPI é open-source e **sem financiamento**. Qualquer mudança que introduza custos de infraestrutura deve ser **rejeitada imediatamente**, independente da qualidade técnica. Não há orçamento para banco de dados, storage ou serviços pagos. Serviços que exigem chave de API ou cadastro prévio devem ser discutidos em issue antes de implementar.

**Verificações Obrigatórias:**

- [ ] Não há loops desnecessários ou processamento pesado
- [ ] Cache é usado quando apropriado
- [ ] Chamadas a APIs externas são minimizadas
- [ ] Não há vazamento de memória (closures, event listeners)
- [ ] Queries são otimizadas
- [ ] Dependências novas são justificadas e leves

**Como Verificar:**
```bash
# Verifique dependências adicionadas
git diff main -- package.json

# Analise lógica de processamento
# Procure por loops aninhados, recursão sem limite, etc.
```

**Perguntas a Fazer:**
- Esta mudança aumentará custos de infraestrutura?
- Há maneira mais eficiente de implementar isso?
- Cache poderia reduzir chamadas a APIs externas?

### ✅ 6. Segurança

**Verificações Obrigatórias:**

- [ ] Inputs de usuário são validados
- [ ] Dados são sanitizados antes de processamento
- [ ] Não há credenciais ou secrets no código
- [ ] CORS está configurado corretamente (`*` para APIs públicas)
- [ ] Não há injeção SQL, XSS ou outras vulnerabilidades
- [ ] Rate limiting é considerado (se aplicável)
- [ ] Erros não expõem informações sensíveis

**Como Verificar:**
```bash
# Procure por secrets expostos
git diff main | grep -i "password\|token\|secret\|key"

# Verifique validação de inputs
grep -n "req.query\|req.body" pages/api/[endpoint]
```

**Perguntas a Fazer:**
- Entrada maliciosa poderia quebrar o sistema?
- Dados sensíveis estão protegidos?
- Erros expõem detalhes de implementação?

### ✅ 7. Arquitetura e Padrões

**Verificações Obrigatórias:**

- [ ] Segue estrutura de diretórios do projeto
- [ ] Usa `next-connect` para endpoints
- [ ] Serviços estão separados de endpoints
- [ ] Middleware está sendo reusado (ex: cors)
- [ ] Tratamento de erros é consistente
- [ ] Versionamento é apropriado (v1, v2, etc.)

**Como Verificar:**
```bash
# Verifique estrutura
tree pages/api/[novo-endpoint]
tree services/
```

**Referência:**
- [Guia de Criação de Endpoints](../docs/ENDPOINT_GUIDE.md) — padrões esperados de handler, service, teste e documentação.

**Perguntas a Fazer:**
- Código segue os padrões existentes no projeto?
- Há reuso de componentes e serviços?
- Estrutura é intuitiva para outros desenvolvedores?

## 🚨 Red Flags - Rejeitar Imediatamente

As seguintes situações devem resultar em **rejeição imediata** do PR:

1. **Quebra de compatibilidade sem nova versão**
   - Remoção/renomeação de campos
   - Mudança de tipos de dados
   - Alteração de URLs

2. **Documentação ausente ou desatualizada**
   - Novo endpoint sem documentação
   - Mudanças não refletidas na documentação

3. **Sem testes**
   - Código novo sem testes E2E
   - Testes falhando

4. **Vulnerabilidades de segurança**
   - Inputs não validados
   - Secrets expostos
   - SQL injection, XSS

5. **Aumento significativo de custos**
   - Processamento pesado sem justificativa (loops aninhados, recursão sem limite, etc.)
   - Dependências novas grandes ou sem justificativa clara

6. **Dependência de infraestrutura paga ou privada**
   - Banco de dados próprio (qualquer engine)
   - Storage (S3, GCS, etc.)
   - Qualquer serviço com custo recorrente ou que exige chave de API privada

7. **Código não segue padrões**
   - ESLint falhando
   - Estrutura diferente do projeto

## ✅ Aprovação Condicional

Situações que podem ser aprovadas **após correções**:

1. **Documentação incompleta** → Solicitar complemento
2. **Testes insuficientes** → Solicitar mais casos de teste
3. **Performance subótima** → Sugerir otimizações
4. **Código complexo** → Solicitar simplificação/refatoração
5. **Nomes ruins** → Solicitar renomeação para melhor clareza

## 💬 Dando Feedback Efetivo

### ✅ Bom Feedback
```markdown
❌ Este campo foi removido, mas isso quebra compatibilidade com v1.
Por favor, mantenha o campo ou crie uma v2.

✅ Sugiro adicionar validação para o parâmetro `cep`:
if (!/^\d{8}$/.test(cep)) {
  return res.status(400).json({ message: 'CEP inválido' });
}

💡 Esta query poderia ser otimizada usando cache:
const cached = await getCache(key);
if (cached) return cached;
```

### ❌ Feedback Ruim
```markdown
❌ "Isso está errado, refaça"
❌ "Não gostei"
❌ "Funciona, mas eu faria diferente"
```

### Princípios de Feedback:

1. **Seja específico**: Aponte exatamente o problema e sugira solução
2. **Seja construtivo**: Critique o código, não a pessoa
3. **Seja educativo**: Explique o "porquê", não apenas o "o que"
4. **Priorize**: Separe crítico de nice-to-have
5. **Reconheça**: Destaque pontos positivos também

## 🎓 Perguntas para Revisores Iniciantes

Se é sua primeira vez revisando, pergunte-se:

1. **Eu entendi o que este código faz?** Se não, peça esclarecimento.
2. **Eu conseguiria dar manutenção neste código?** Se não, pode estar muito complexo.
3. **Este código pode quebrar algo?** Procure por efeitos colaterais.
4. **Documentação está clara?** Leia como se você fosse usar a API.
5. **Testes cobrem o essencial?** Tente pensar em casos não cobertos.

## 📊 Checklist Rápida de Revisão

Para cada PR, verifique rapidamente:

```
⚠️  CRÍTICO
└─ [ ] Compatibilidade de API mantida
└─ [ ] Documentação atualizada
└─ [ ] Testes passando

⚡ IMPORTANTE  
└─ [ ] Código limpo e legível
└─ [ ] Performance aceitável
└─ [ ] Segurança validada

✨ NICE-TO-HAVE
└─ [ ] Comentários úteis
└─ [ ] Código otimizado
└─ [ ] Tratamento de edge cases
```

## 🔄 Processo de Revisão

### 1. Primeira Leitura (5-10 min)
- Leia o PR description
- Entenda o objetivo
- Identifique arquivos modificados
- Procure red flags óbvios

### 2. Revisão Detalhada (15-30 min)
- Verifique checklist obrigatória
- Analise lógica do código
- Teste localmente se necessário
- Valide documentação

### 3. Feedback (5-10 min)
- Liste problemas críticos (blocking)
- Liste sugestões (não-blocking)
- Destaque pontos positivos
- Seja claro sobre o que precisa ser mudado

### 4. Aprovação
- **Aprovar**: Tudo ok ou apenas sugestões menores
- **Request Changes**: Problemas que devem ser corrigidos
- **Comment**: Dúvidas ou discussões necessárias

## 🤝 Quando Pedir Ajuda

Não tenha medo de pedir ajuda quando:

- Não entender o código ou tecnologia
- Não ter certeza se algo quebra compatibilidade
- Precisar de opinião sobre segurança
- Mudança impactar área que você não conhece

Mencione outros revisores: `@fulano pode revisar a parte de segurança?`

## 📚 Recursos de Apoio

- [Instruções Copilot](copilot-instructions.md) - Padrões do projeto
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Guia de contribuição
- [README.md](../README.md) - Visão geral do projeto
- [OpenAPI Docs](https://brasilapi.com.br/docs) - Documentação da API

---

**Lembre-se**: Revisão de código é sobre **manter qualidade** e **proteger usuários**. Seja rigoroso, mas construtivo. Um PR recusado hoje evita bugs em produção amanhã. 🛡️

Obrigado por contribuir com a qualidade da BrasilAPI! 🇧🇷

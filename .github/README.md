# Arquivos de Instruções e Automação

Este diretório contém arquivos de configuração e instruções para auxiliar no desenvolvimento e revisão de código do BrasilAPI.

## 📚 Arquivos de Instrução

### 🤖 Para GitHub Copilot e Desenvolvedores

#### [`copilot-instructions.md`](copilot-instructions.md)
**Propósito:** Instruções gerais para desenvolvimento assistido por IA

**Uso:**
- Referenciado automaticamente pelo GitHub Copilot durante desenvolvimento
- Guia para desenvolvedores entenderem padrões do projeto
- Define princípios fundamentais: compatibilidade, documentação, custos, qualidade

**Conteúdo:**
- Visão geral e missão do projeto
- Arquitetura e padrões de código
- Workflow para criar endpoints
- Exemplos de código e testes
- FAQ e comandos úteis

#### [`copilot-review-instructions.md`](copilot-review-instructions.md)
**Propósito:** Instruções específicas para revisão automática de PRs pelo GitHub Copilot

**Uso:**
- Treina o Copilot para revisar PRs seguindo nossos padrões
- Define critérios objetivos de aprovação/rejeição
- Automatiza parte do processo de code review

**Conteúdo:**
- Regras não-negociáveis (breaking changes, documentação, testes, segurança)
- Checklist obrigatória de revisão em 7 categorias
- Templates de feedback específico para cada tipo de problema
- Priorização: crítico vs importante vs sugestão
- Casos especiais (doc-only, dependabot, refatoração)

**Como funciona:**
1. Desenvolvedor abre PR
2. GitHub Copilot lê este arquivo
3. Copilot analisa mudanças seguindo checklist
4. Copilot comenta problemas encontrados com soluções específicas
5. Copilot sugere aprovação ou solicita mudanças

### 👥 Para Revisores Humanos

#### [`CODE_REVIEW_GUIDELINES.md`](CODE_REVIEW_GUIDELINES.md)
**Propósito:** Guia completo para revisores humanos

**Uso:**
- Consulta durante revisão manual de PRs
- Treinamento de novos revisores
- Referência para critérios de qualidade

**Conteúdo:**
- Checklist detalhada de revisão
- Como verificar compatibilidade de API
- Como validar documentação e testes
- Como avaliar performance e custos
- Como identificar vulnerabilidades
- Como dar feedback efetivo
- Red flags para rejeição imediata

### 📝 Para Contribuidores

#### [`PULL_REQUEST_TEMPLATE.md`](PULL_REQUEST_TEMPLATE.md)
**Propósito:** Template automático para todos os PRs

**Uso:**
- Aplicado automaticamente ao abrir novo PR
- Guia contribuidor no checklist antes de submeter
- Garante que informações essenciais sejam fornecidas

**Conteúdo:**
- Checklists de compatibilidade, documentação, testes, código
- Seção para descrever como testar
- Instruções para revisores
- Lembretes sobre impacto em produção

## 🔄 Workflow de Contribuição

```mermaid
graph TD
    A[Desenvolvedor inicia mudança] --> B[Consulta copilot-instructions.md]
    B --> C[Implementa seguindo padrões]
    C --> D[Executa testes localmente]
    D --> E[Abre PR usando template]
    E --> F{Copilot Review Automático}
    F -->|Problemas| G[Desenvolvedor corrige]
    G --> F
    F -->|OK| H{Revisão Humana}
    H -->|Segue CODE_REVIEW_GUIDELINES| I[Aprovação]
    H -->|Problemas| J[Feedback detalhado]
    J --> G
    I --> K[Merge]
```

## 🎯 Diferença entre os Arquivos

| Arquivo | Audiência | Momento | Foco |
|---------|-----------|---------|------|
| `copilot-instructions.md` | Copilot + Devs | Durante desenvolvimento | Como escrever código |
| `copilot-review-instructions.md` | Copilot | Durante review automático | Como revisar código |
| `CODE_REVIEW_GUIDELINES.md` | Revisores humanos | Durante review manual | Como revisar profundamente |
| `PULL_REQUEST_TEMPLATE.md` | Contribuidor | Ao abrir PR | O que incluir no PR |

## 🤖 Quais Arquivos São Usados Automaticamente?

### ✅ Arquivos Automáticos (Nenhuma Configuração Necessária)

#### 1. `PULL_REQUEST_TEMPLATE.md`
- ✅ **Uso 100% automático**
- Aplicado automaticamente quando qualquer pessoa abre um PR
- Não requer nenhuma configuração
- Funciona imediatamente após o merge

#### 2. `copilot-instructions.md`
- ✅ **Uso automático pelo GitHub Copilot**
- GitHub Copilot no VS Code/IDE detecta e usa automaticamente
- Aplicado durante desenvolvimento quando Copilot está ativo
- Não requer configuração adicional no repositório
- **Requisito**: Desenvolvedor precisa ter GitHub Copilot instalado no IDE

### ⚙️ Arquivos que Requerem Ação Manual

#### 3. `copilot-review-instructions.md`
- ⚙️ **Uso via comando ou configuração**
- **Opção A - Uso manual por mantenedores**: Comente no PR:
  ```
  @copilot review
  ```
  Ou mencione o arquivo específico:
  ```
  @copilot review following .github/copilot-review-instructions.md
  ```
- **Opção B - Configuração automática** (se disponível no plano):
  - GitHub Copilot Enterprise pode ter configuração para revisão automática
  - Verificar em Settings → Copilot do repositório
- **Uso alternativo**: Mantenedores podem usar como checklist manual

#### 4. `CODE_REVIEW_GUIDELINES.md`
- 📖 **Documento de referência - uso manual**
- Revisores humanos consultam durante review
- Não é usado automaticamente por ferramentas
- Serve como guia e treinamento

#### 5. `README.md` (este arquivo)
- 📖 **Documentação - uso manual**
- Explicação sobre todos os outros arquivos
- Consultado quando necessário

## 🚀 Resumo: Configuração Necessária

| Arquivo | Automático? | Ação Necessária |
|---------|-------------|-----------------|
| `PULL_REQUEST_TEMPLATE.md` | ✅ Sim | Nenhuma - já funciona |
| `copilot-instructions.md` | ✅ Sim (com Copilot no IDE) | Nenhuma - desenvolvedores precisam ter Copilot |
| `copilot-review-instructions.md` | ⚙️ Parcial | Mantenedores devem usar `@copilot review` nos PRs |
| `CODE_REVIEW_GUIDELINES.md` | ❌ Não | Revisores consultam manualmente |
| `README.md` | ❌ Não | Documentação de referência |

## 💡 Recomendações de Uso

### Para Começar Agora (Zero Configuração)
1. **Template de PR**: Já funciona! Próximo PR terá o template automaticamente
2. **Instruções de desenvolvimento**: Desenvolvedores com Copilot já recebem as instruções automaticamente

### Para Aproveitar Revisão Automática
**Mantenedores devem**, em cada PR importante:
```bash
# Comentar no PR para pedir revisão do Copilot
@copilot review
```

Isso fará o Copilot analisar o PR seguindo as regras em `copilot-review-instructions.md`

### Para Revisão Manual
Revisores humanos devem consultar `CODE_REVIEW_GUIDELINES.md` como guia detalhado

## 🔧 Configuração Avançada (Opcional)

Se sua organização tem **GitHub Copilot Enterprise**, você pode:
1. Ir em **Settings** → **Copilot** (no nível da organização ou repositório)
2. Procurar por opções de "Code Review" ou "PR Review"
3. Configurar revisão automática para todos os PRs
4. O Copilot usará `copilot-review-instructions.md` automaticamente

> **Nota**: Esta funcionalidade pode não estar disponível em todos os planos. Consulte a [documentação do GitHub Copilot](https://docs.github.com/en/copilot) para detalhes.

## 📖 Mantendo as Instruções

### Quando Atualizar

**`copilot-instructions.md`:**
- Novos padrões de código são adotados
- Mudanças em arquitetura
- Novos comandos ou ferramentas
- Lições aprendidas de erros comuns

**`copilot-review-instructions.md`:**
- Novos tipos de problemas frequentes em PRs
- Mudanças em critérios de aprovação
- Novos checks automatizados necessários
- Feedback que deve ser padronizado

**`CODE_REVIEW_GUIDELINES.md`:**
- Processos de revisão evoluem
- Novos requisitos de qualidade
- Melhores práticas são descobertas

**`PULL_REQUEST_TEMPLATE.md`:**
- Informações faltando frequentemente em PRs
- Novos checks necessários antes do merge

### Como Atualizar

1. Abra PR com mudanças nas instruções
2. Explique motivo da mudança
3. Se possível, referencie PRs que motivaram a mudança
4. Peça feedback de outros mantenedores
5. Merge após aprovação

## 🎓 Filosofia do Projeto

Todos esses arquivos refletem os princípios fundamentais do BrasilAPI:

1. **🔒 Compatibilidade é sagrada**: Nunca quebre aplicações existentes
2. **📝 Documentação é obrigatória**: Código sem doc não existe
3. **💰 Custos devem ser zero**: Projeto deve ser sustentável sem financiamento
4. **🔐 Segurança em primeiro lugar**: Proteção de dados e validação sempre
5. **✅ Qualidade é mandatória**: Testes, linting, padrões são obrigatórios
6. **🌍 Open-source e comunidade**: Decisões transparentes e colaborativas

## 📞 Dúvidas?

- Para dúvidas sobre desenvolvimento: Ver `copilot-instructions.md`
- Para dúvidas sobre revisão: Ver `CODE_REVIEW_GUIDELINES.md`
- Para dúvidas sobre contribuição: Ver `/CONTRIBUTING.md`
- Para issues: [github.com/BrasilAPI/BrasilAPI/issues](https://github.com/BrasilAPI/BrasilAPI/issues)

---

**Mantido pela comunidade BrasilAPI** 🇧🇷

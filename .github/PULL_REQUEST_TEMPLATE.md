<!-- 
🤖 Este PR será revisado automaticamente pelo GitHub Copilot seguindo nossos padrões de qualidade.
Para entender os critérios de revisão, consulte: .github/copilot-review-instructions.md
-->

## 📋 Descrição

<!-- Descreva de forma clara e objetiva as mudanças propostas neste PR -->

## 🎯 Tipo de Mudança

<!-- Marque com "x" o tipo de mudança -->

- [ ] 🐛 Correção de bug (mudança que corrige um problema)
- [ ] ✨ Nova funcionalidade (mudança que adiciona funcionalidade)
- [ ] 💥 Breaking change (correção ou funcionalidade que causa quebra de compatibilidade)
- [ ] 📝 Documentação (mudanças apenas em documentação)
- [ ] ♻️ Refatoração (mudança que não corrige bug nem adiciona funcionalidade)
- [ ] ⚡ Performance (mudança que melhora performance)
- [ ] ✅ Testes (adiciona ou corrige testes)
- [ ] 🔧 Configuração (mudanças em configuração ou build)

## ⚠️ Checklist de Compatibilidade (CRÍTICO)

<!-- ATENÇÃO: BrasilAPI é usada por milhares de aplicações em produção -->

- [ ] ✅ Não remove campos de respostas de API existentes
- [ ] ✅ Não renomeia campos de respostas de API existentes
- [ ] ✅ Não muda tipos de dados de campos existentes (string → number, etc.)
- [ ] ✅ Não muda o formato de URLs de endpoints existentes
- [ ] ✅ Não muda códigos de status HTTP de endpoints existentes
- [ ] ✅ Se fez mudanças incompatíveis, criei uma nova versão (v2, v3, etc.)

<!-- Se marcou algum item como NÃO, explique o motivo e impacto -->

## 📚 Checklist de Documentação

- [ ] ✅ Atualizei ou criei documentação OpenAPI em `/pages/docs/doc/`
- [ ] ✅ Documentação inclui exemplos de requisição e resposta
- [ ] ✅ Documentação está em português
- [ ] ✅ Atualizei README.md se necessário
- [ ] ✅ N/A - Mudanças não requerem documentação

## 🧪 Checklist de Testes

- [ ] ✅ Criei ou atualizei testes E2E
- [ ] ✅ Todos os testes passam localmente (`npm test`)
- [ ] ✅ Teste de CORS funciona corretamente
- [ ] ✅ Testei casos de erro (404, 400, 500, etc.)
- [ ] ✅ Testei casos de sucesso
- [ ] ✅ N/A - Mudanças não requerem testes

## 💻 Checklist de Código

- [ ] ✅ Código segue os padrões do projeto (ESLint + Prettier)
- [ ] ✅ Executei `npm run fix` antes de commitar
- [ ] ✅ Não adicionei dependências desnecessárias ou pesadas
- [ ] ✅ Código não expõe credenciais ou informações sensíveis
- [ ] ✅ Validei todos os inputs de usuário
- [ ] ✅ Tratei erros apropriadamente
- [ ] ✅ Usei Conventional Commits

## 🚀 Checklist de Performance e Custos

<!-- BrasilAPI é um projeto sem custos - devemos manter assim -->

- [ ] ✅ Não adicionei processamento pesado que aumenta custos
- [ ] ✅ Usei cache quando apropriado
- [ ] ✅ Minimizei chamadas a APIs externas
- [ ] ✅ Considerei impacto em rate limits de APIs externas
- [ ] ✅ Testei performance em casos de alto volume

## 🔍 Como Testar

<!-- Descreva os passos para testar este PR -->

1. 
2. 
3. 

## 📸 Screenshots (se aplicável)

<!-- Adicione screenshots se as mudanças afetam a UI -->

## 📎 Issues Relacionadas

<!-- Link para issues relacionadas: Closes #123, Fixes #456 -->

## 📝 Notas Adicionais

<!-- Informações adicionais relevantes para os revisores -->

---

## ⚠️ Para Revisores

**Pontos de Atenção Críticos:**

1. **Compatibilidade**: Verifique se há quebra de contrato de API
2. **Documentação**: Confirme que está atualizada e completa
3. **Testes**: Valide cobertura de casos de sucesso e erro
4. **Performance**: Avalie impacto em custos e velocidade
5. **Segurança**: Verifique validação de inputs e exposição de dados

**Lembre-se**: BrasilAPI serve milhares de desenvolvedores e empresas importantes. Mudanças devem ser cuidadosamente avaliadas para garantir confiabilidade e zero downtime.

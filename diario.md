### Diário de Refatoração

Esse diário documenta nossas etapas de identificação e refatoração de code smells no projeto BrasilAPI.

### Refatoração 1 – Falta de validação de propriedades (smell-type: missing-props-validation)
- **identificação:** analisando todos os code smells detectados através do sonarcloud.
- **Arquivo:** pages/_app.js
- **Dificuldades:** 
- **Método de refatoração:** refatoração de comentário, improve readability
- **Mudanças observadas:** 
- **Evidências:** issue #3

### Refatoração 2 – Uso ineficiente de estrutura de dados (smell-type: inefficient-data-structure)
- **identificação:** analisando todos os code smells detectados através do sonarcloud.
- **Arquivo:**  pages/api/cep/v1/[cep].js
- **Dificuldades:** garantir que todos os pontos do código que usavam .includes() fossem migrados para .has(), evitar duplicidade de declarações e testar bem para confirmar que a lógica de bloqueio não foi quebrada.
- **Método de refatoração:** Replace Data Structure (substituição de estrutura de dados)
- **Mudanças observadas:** Antes: const tempBlockedIps = new Set(); const tempBlockedUserAgents = new Set(['Go-http-client/2.0']); uso de .has() para verificar existência. Depois: foram declarados duplicados: primeiro como [] e depois como new Set(). , dentro dos if, aparecem chamadas redundantes: .includes() e .has() juntos e isso gera inconsistência e erro de sintaxe (faltou operador lógico entre algumas condições).
- **Evidências:** issue #4

### Refatoração 3 – Parâmetro padrão inadequado (smell-type: improper-default-parameter)
- **identificação:** analisando todos os code smells detectados através do sonarcloud.
- **Arquivo:** services/fipe/automakers.js
- **Dificuldades:** 
- **Método de refatoração:** 
- **Mudanças observadas:** 
- **Evidências:** issue #5

### Refatoração 4 – Estilo de exportação ineficiente (smell-type: inefficient-export-style)
- **identificação:** analisando todos os code smells detectados através do sonarcloud.
- **Arquivo:** services/cptec/index.js
- **Dificuldades:** 
- **Método de refatoração:**
- **Mudanças observadas:**
- **Evidências:** issue #6

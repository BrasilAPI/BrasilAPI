### Diário de Refatoração

Esse diário documenta nossas etapas de identificação e refatoração de code smells no projeto BrasilAPI.

### Refatoração 1 – Falta de validação de propriedades (smell-type: missing-props-validation)
- **identificação:** analisando todos os code smells detectados através do sonarcloud.
- **Arquivo:** pages/_app.js
- **Dificuldades:** a principal dificuldade foi garantir que os tipos escolhidos em PropTypes fossem compatíveis com o comportamento do Next.js, já que Component precisa aceitar qualquer página que o framework forneça.
- **Método de refatoração:** refatoração de comentário, improve readability, inclusão de PropTypes e definição de propTypes e defaultProps dentro do componente MyApp, atendendo as recomendações de maintainability do Sonarcloud.
- **Mudanças observadas:** antes o arquivo não validava nenhuma das props, deixando o componente vulnerável a valores incorretos. Depois da refatoração, Component passou a exigir um elementType obrigatório e pageProps passou a ser tratado como objeto com valor padrão vazio, eliminando warnings e deixando o contrato de uso explícito.
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
- **Dificuldades:** garantir que a mudança não quebrasse chamadas existentes que dependiam implicitamente da antiga assinatura, além de revisar a cadeia de chamadas para confirmar que nenhum módulo assumia a estrutura anterior do parâmetro.
- **Método de refatoração:** Replace default object parameter with primitive default (substituição de parâmetro de objeto padrão pelo valor padrão primitivo) ;padronização da assinatura das funções
- **Mudanças observadas:** simplificação da função, maior clareza para outros desenvolvedores e eliminação de ambiguidades sobre mutabilidade e compartilhamento de objetos padrão.
- **Evidências:** issue #5

### Refatoração 4 – Estilo de exportação ineficiente (smell-type: inefficient-export-style)
- **identificação:** analisando todos os code smells detectados através do sonarcloud.
- **Arquivo:** services/cptec/index.js
- **Dificuldades:** A principal dificuldade foi evitar regressões ao remover as exportações redundantes para garantir que nenhum módulo perdesse dependências e que todos os nomes e caminhos continuassem corretos.
- **Método de refatoração:** replace indirect export with direct export (remover o export único que agrupava várias funções), exportar explicitamente cada item no mesmo ponto onde é importado, melhorar a consistencia do código, adotar um único padrão de export no módulo para reduzir ambiguidade e custo cognitivo e remove redundant re-exports.
- **Mudanças observadas:** antes o arquivo usava importações no topo e um único bloco de exportação reunindo tudo, criando duplicidade e dificultando ver de onde cada função vinha. Depois da refatoração, cada módulo passou a exportar diretamente suas funções na mesma linha do import, removendo redundâncias e deixando o arquivo mais claro, consistente e fácil de manter.
- **Evidências:** issue #6

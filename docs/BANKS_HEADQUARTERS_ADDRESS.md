# Enderecos de Sede dos Bancos (headquarters_address)

## 1. Contexto e objetivo

Este documento descreve a implementacao do enriquecimento de endereco da sede para o endpoint de bancos, incluindo:

- enriquecimento em camadas com fontes externas
- regras de confianca dos dados
- resiliencia para nao quebrar o endpoint
- geracao de snapshots versionados
- automacao periodica via GitHub Actions
- metricas operacionais (cobertura, novos nulos e conflitos)

Implementacao pensada para manter compatibilidade retroativa: os campos antigos seguem existindo e os novos campos sao opcionais.

---

## 2. Campos adicionados no payload de bancos

Cada banco passou a poder retornar os campos abaixo:

- `cnpj`: string ou `null`
- `headquarters_address`: objeto ou `null`
- `address_source`: string ou `null`
- `address_last_sync`: datetime ISO-8601
- `address_confidence`: `high | medium | low | none`

Estrutura de `headquarters_address`:

- `street`
- `number`
- `complement`
- `district`
- `city`
- `state`
- `zipCode`

Todos os campos internos de `headquarters_address` podem ser `string` ou `null`.

---

## 3. Fontes de dados utilizadas

### 3.1 Fonte base de bancos

- CSV oficial de participantes STR (BCB)
- URL: `https://www.bcb.gov.br/content/estabilidadefinanceira/str1/ParticipantesSTR.csv`

### 3.2 Fonte primaria de enderecos (BCB OData)

Colecoes consultadas:

- `SedesBancoComMultCE`
- `SedesCooperativas`
- `SedesSociedades`
- `SedesConsorcios`

Todas no servico:

- `https://olinda.bcb.gov.br/olinda/servico/Instituicoes_em_funcionamento/versao/v1/odata/`

### 3.3 Fonte secundaria de enderecos por CNPJ

- API: `https://minhareceita.org/{cnpj}`
- usada para bancos sem endereco apos etapa BCB, quando houver CNPJ valido (14 digitos)

---

## 4. Regras de matching e confianca

### 4.1 Normalizacao de texto

Antes de comparar nomes:

- remove acentos
- transforma em uppercase
- remove caracteres nao alfanumericos
- compacta espacos

### 4.2 Ordem de matching

1. `bcb_sedes_exact_match` por nome normalizado (`fullName`)
2. `bcb_sedes_exact_match` por nome normalizado (`name`)
3. `name_based_match` (fuzzy unico por inclusao de string)
4. sem match

### 4.3 Regra de confianca

- `bcb_sedes_exact_match` -> `high`
- `cnpj_exact_match` -> `medium`
- `name_based_match` -> `low`
- sem match -> `none`

### 4.4 Regra de CNPJ

CNPJ so e considerado valido quando possui 14 digitos.

- CNPJ com tamanho diferente de 14 e descartado (`null`)
- essa regra evita usar raiz de CNPJ (8 digitos) como se fosse CNPJ completo

---

## 5. Comportamento de resiliencia no endpoint

Implementado no servico de bancos para evitar indisponibilidade ou regressao forte de dados.

### 5.1 Cache em memoria (runtime)

- TTL de 6 horas
- evita reprocessamento pesado a cada requisicao

### 5.2 Fallback de snapshot local

Se houver falha na coleta da base STR ou falha geral no enriquecimento:

- usa `services/banco-central/snapshots/latest.json`, quando disponivel
- caso contrario, usa fallback estatico local (`banksList.json`)

### 5.3 Guardrail de cobertura

Se o enriquecimento atual vier com cobertura zerada e o snapshot anterior tiver cobertura positiva:

- mantem snapshot anterior como resposta
- evita regressao brusca para clientes

---

## 6. Snapshot versionado e metricas

### 6.1 Script de geracao

Arquivo:

- `scripts/generate-bank-headquarters-snapshot.js`

Comando:

- `npm run snapshot:banks`

### 6.2 Arquivos gerados

Diretorio:

- `services/banco-central/snapshots/`

Arquivos:

- `banks-headquarters-<run-id>.json` (historico versionado)
- `latest.json` (snapshot promovido para producao)
- `metrics-latest.json` (metricas da ultima execucao)

### 6.3 Regras de promocao de latest

O script sempre gera snapshot versionado, mas so promove para `latest.json` quando:

- existe cobertura (`with_address > 0`)
- cobertura atual respeita guardrail minimo:
  - se houver historico: cobertura atual >= 80% da cobertura anterior
  - sem historico: cobertura minima absoluta de 20%

Se nao passar no guardrail:

- `latest.json` anterior e preservado
- metrica registra fallback com motivo `coverage_guardrail`

### 6.4 Metricas emitidas

Em `metrics-latest.json`:

- `totals.banks`
- `totals.with_address`
- `totals.without_address`
- `totals.coverage_total`
- `deltas.new_nulls`
- `deltas.recovered_addresses`
- `conflicts.count`
- `sources.bcb_failed_sources`
- `sources.cnpj_lookup_candidates`
- `sources.cnpj_failed_lookups`

#### Definicao de conflito

Conflito = mesmo nome normalizado com fontes de endereco diferentes (`address_source` distintos) no conjunto final.

---

## 7. Automacao periodica (GitHub Actions)

Workflow:

- `.github/workflows/banks-headquarters-snapshot.yml`

Triggers:

- agendado semanalmente (`cron: 0 6 * * 1`)
- execucao manual (`workflow_dispatch`)

Fluxo:

1. checkout do repositorio
2. setup Node 20
3. cache/install de dependencias
4. execucao de `npm run snapshot:banks`
5. upload de artefatos JSON
6. commit/push de snapshots alterados

Permissao necessaria:

- `contents: write`

---

## 8. Compatibilidade e contrato de API

- campos antigos foram mantidos
- novos campos sao opcionais
- quando nao houver dado confiavel, retorno deve ser `null` (nao erro)
- endpoint continua respondendo mesmo com falha parcial/total de fontes externas

---

## 9. Observacoes importantes do estado atual

1. O pipeline esta ativo e funcional localmente.
2. Quantidade atual de enderecos obtidos (metrics-latest):
  - total de bancos processados: 480
  - bancos com endereco: 458
  - bancos sem endereco: 22
  - cobertura total: 95,42%
3. `cnpj_lookup_candidates` pode ficar em zero dependendo da disponibilidade/formato de CNPJ vindo do matching BCB.
4. Mesmo com falha de fontes externas, o endpoint nao deve quebrar por causa do fallback em `latest.json`.

---

## 10. Arquivos envolvidos

Implementacao principal:

- `services/banco-central/index.js`
- `scripts/generate-bank-headquarters-snapshot.js`
- `.github/workflows/banks-headquarters-snapshot.yml`
- `package.json`

Dados gerados:

- `services/banco-central/snapshots/latest.json`
- `services/banco-central/snapshots/metrics-latest.json`
- `services/banco-central/snapshots/banks-headquarters-<run-id>.json`

Testes/documentacao relacionados:

- `tests/banks-v1.test.js`
- `pages/docs/doc/bank.json`

---

## 11. Execucao manual (operacao)

Para rodar localmente:

```bash
npm run snapshot:banks
```

Para verificar resultados:

- abrir `services/banco-central/snapshots/metrics-latest.json`
- confirmar se `fallback.used_previous_snapshot` e `false` para promocao normal
- validar `totals.coverage_total`, `deltas.new_nulls` e `conflicts.count`

---

## 12. Decisao sobre historico

No momento, o historico versionado e mantido sem politica de retencao automatica.
A retencao pode ser adicionada futuramente, mas foi explicitamente deixada fora desta etapa.

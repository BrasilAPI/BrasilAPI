# Hospitais de referência do SUS (`/api/hospitais/v1`)

## O que é

Hospitais de referência habilitados pelo SUS, em três verticais — animais peçonhentos (soros antiveneno), oncologia (habilitações CGCAN) e doenças raras (habilitações SRDR/SAE) — mais os centros CIATOX de assistência toxicológica.

## Fonte dos dados

**Documentos de origem:** Ministério da Saúde, em `gov.br/saude` — PDFs estaduais e planilhas XLSX de habilitação, não uma API.

**Intermediário:** [MapaSUS](https://mapasus.com.br) ([Codar-Sistemas/hospitais-referencia-api](https://github.com/Codar-Sistemas/hospitais-referencia-api), MIT), que faz o scraping diário desses documentos, extrai, normaliza, geocodifica e republica como API REST. O BrasilAPI consome o resultado desse trabalho.

### Isto não é um serviço oficial do Ministério da Saúde

Nem o MapaSUS nem o BrasilAPI têm vínculo com o órgão. Os dados vêm de documentos públicos reais do Ministério, mas a extração é automatizada e pode conter erros ou estar defasada em relação à fonte.

Toda resposta carrega isso explicitamente, em `fonte`:

```json
{
  "nome": "MapaSUS",
  "url": "https://mapasus.com.br",
  "oficial": false,
  "documentos_de_origem": "Ministério da Saúde — gov.br/saude",
  "aviso": "O MapaSUS e a BrasilAPI não são serviços oficiais..."
}
```

O texto do aviso vive em `services/hospitais/index.js`, não no snapshot — é conteúdo editorial e precisa passar por review, não ser regenerado por script.

### Aviso de emergência

Alguém pode consultar esta API no meio de um acidente. Toda resposta traz um objeto `emergencia` com a orientação de ligar **192 (SAMU)** e, em caso de acidente com animal peçonhento ou intoxicação, ligar para o CIATOX **antes de se deslocar** — a unidade listada pode estar sem o soro no momento. É a mesma orientação do cartão "ligue primeiro" do site do MapaSUS.

Se você constrói uma interface sobre estes dados, **exiba esse aviso ao usuário final.**

## Por que um snapshot, e não uma chamada em request-time

**O MapaSUS roda inteiramente em free tier** (Supabase + Vercel Hobby) e limita a 15 requisições por minuto por IP.

O BrasilAPI atende milhares de desenvolvedores a partir de lambdas efêmeras. Sob pico, a Vercel sobe dezenas de instâncias em paralelo, e cada cold start dispararia uma rajada de requisições para popular seu cache local. Não existe estado compartilhado entre lambdas para coordenar isso — o princípio de custo zero do projeto proíbe Redis ou banco próprio. O resultado seria multiplicar um pico de tráfego do BrasilAPI em cima de um serviço gratuito, exatamente no pior momento.

Por isso **nenhuma rota do BrasilAPI chama o MapaSUS**. O dataset é servido de um snapshot commitado, e o único consumidor automatizado é o workflow diário.

| Modelo | Requisições/mês | Egress | % da cota do Supabase (5 GB) |
|---|---|---|---|
| Snapshot diário (atual) | ~2.500 | ~51 MB | 1% |
| Proxy em request-time | ilimitado | estoura em dias | — |

É o mesmo raciocínio por trás do snapshot de sedes de bancos, documentado em [BANKS_HEADQUARTERS_ADDRESS.md](BANKS_HEADQUARTERS_ADDRESS.md).

## Como o snapshot é gerado

`scripts/generate-hospitais-snapshot.js`, executado por `.github/workflows/hospitais-snapshot.yml` diariamente às 07:00 UTC, com `workflow_dispatch` para execução manual.

```bash
npm run snapshot:hospitais
```

A API do MapaSUS exige ao menos um filtro por chamada — é uma proteção anti-crawl —, então a coleta é particionada por UF: 27 UFs × 3 verticais, mais `/v1/states` e `/v1/ciatox`. São ~83 requisições, **serializadas com pausa de 5 s** entre elas (12 req/min, abaixo do teto de 15). Um `429` dispara espera de 65 s e uma única retentativa.

Saída em `services/hospitais/snapshots/`:

- `latest.json` — o dataset servido pela API
- `metrics-latest.json` — contagens por vertical, cobertura de geocoding e deltas em relação à execução anterior

### Guardrail de promoção

Um sync quebrado no MapaSUS não pode zerar o dataset que o BrasilAPI serve. O `latest.json` só é sobrescrito se a coleta trouxer **pelo menos 80% dos registros da execução anterior**. Abaixo disso, o snapshot anterior é preservado e `metrics-latest.json` registra `fallback.reason = "count_guardrail"`. Falha total de coleta grava `fallback.reason = "source_collection_failure"` e sai com código 1.

O workflow commita apenas `latest.json` e `metrics-latest.json` — não versiona arquivos datados por execução.

## Busca

Um único parâmetro, `atendimento`, atravessa as três verticais:

```
/api/hospitais/v1?atendimento=cascavel          → soro crotálico
/api/hospitais/v1?atendimento=radioterapia      → habilitação de oncologia
/api/hospitais/v1?atendimento=terapia-genica    → área de doenças raras
/api/hospitais/v1?atendimento=17.07             → código de portaria
```

O vocabulário vive em `services/hospitais/vocabulario.js` e espelha `lib/services/search-normalizer.ts` e `lib/services/disease-areas.ts` do MapaSUS — mantenha os dois em sincronia. Acento, caixa, hífen, underscore e espaço são equivalentes.

Uma versão anterior tinha também `tratamento` e `habilitacao`. Foram removidos: resolviam contra o mesmo vocabulário e devolviam resultados idênticos ao de `atendimento`, só triplicando o que o usuário precisa decidir antes da primeira chamada. Para restringir a uma vertical, use `vertical=`.

Termo fora do vocabulário devolve **400** com a lista de valores aceitos. Devolver lista vazia esconderia um erro de digitação atrás de "nenhum hospital encontrado" — num endpoint de saúde isso é pior que um erro explícito.

`GET /api/hospitais/v1/opcoes` lista todos os valores aceitos com rótulo em português, grafias alternativas e contagem, para montar seletores sem depender da documentação.

## Limitações conhecidas

- **Peçonhentos está congelado.** O Ministério da Saúde despublicou as 27 páginas estaduais em julho de 2026; elas redirecionam para um login wall que responde `200`. O MapaSUS detecta isso, classifica como `source_unpublished` e continua servindo o último snapshot válido. Os dados seguem corretos, mas não recebem atualização da fonte.
- **Parte dos registros vem de OCR.** O campo `requires_verification` marca extrações de baixa confiança. Exponha esse campo ao usuário final em qualquer uso crítico.
- **Nem todo hospital tem coordenadas.** `/proximos` ignora registros sem `lat`/`lng` — hoje ~99,7% estão geocodificados.

## Estrutura

As camadas dependem numa direção só: `vocabulario.js` não importa nada, `query.js` importa só o vocabulário, e `index.js` é o único módulo que conhece o snapshot.

| Arquivo | Papel |
|---|---|
| `pages/api/hospitais/v1/*.js` | Handlers finos: roteamento e resposta |
| `services/hospitais/vocabulario.js` | Termos aceitos e seus aliases — puro, sem dependências |
| `services/hospitais/query.js` | Validação dos parâmetros de query e paginação |
| `services/hospitais/origem.js` | Resolve a origem de `/proximos` (CEP, coordenadas ou município) |
| `services/hospitais/index.js` | Carrega o snapshot e filtra em memória |
| `util/haversine.js` | Distância de grande círculo, em metros |
| `scripts/generate-hospitais-snapshot.js` | Geração do snapshot |
| `pages/docs/doc/hospitais.json` | OpenAPI |
| `tests/hospitais-v1.test.js` | E2E das quatro rotas |
| `tests/services/hospitais/vocabulario.test.js` | Unidade: aliases e extração de códigos de OCR |

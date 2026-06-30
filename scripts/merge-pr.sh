#!/usr/bin/env bash
# =============================================================================
# BrasilAPI — Merge de PR com validação e agradecimento automático
#
# Uso: ./scripts/merge-pr.sh <pr-number>
#
# Fluxo:
#   1. Coleta metadados do PR (autor, título, URL de preview Vercel)
#   2. Valida produção (baseline)
#   3. Valida preview do PR (se disponível)
#   4. Agradece o contributor (se externo)
#   5. Mergeia com squash
# =============================================================================

set -euo pipefail

PR_NUM="${1:?Uso: $0 <pr-number>}"
MAINTAINER="lucianopf"
PROD="https://brasilapi.com.br"

PASS=0
FAIL=0

green()  { printf "\033[32m✓\033[0m %s\n" "$*"; }
red()    { printf "\033[31m✗\033[0m %s\n" "$*"; }
yellow() { printf "\033[33m⚠\033[0m %s\n" "$*"; }
header() { printf "\n\033[1m=== %s ===\033[0m\n" "$*"; }

# ---------------------------------------------------------------------------
# Assertions
# ---------------------------------------------------------------------------

assert_status() {
  local label="$1" url="$2" expected="$3"
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")
  if [ "$status" = "$expected" ]; then
    green "$label → HTTP $status"
    ((PASS++)) || true
  else
    red "$label → esperado HTTP $expected, obtido HTTP $status"
    ((FAIL++)) || true
  fi
}

assert_field() {
  local label="$1" url="$2" field="$3" expected="$4"
  local actual
  actual=$(curl -s --max-time 10 "$url" 2>/dev/null \
    | python3 -c "import sys,json; d=json.load(sys.stdin); print(d$field)" 2>/dev/null \
    || echo "ERROR")
  if [ "$actual" = "$expected" ]; then
    green "$label → $field = '$actual'"
    ((PASS++)) || true
  else
    red "$label → $field: esperado '$expected', obtido '$actual'"
    ((FAIL++)) || true
  fi
}

assert_is_array() {
  local label="$1" url="$2"
  local result
  result=$(curl -s --max-time 10 "$url" 2>/dev/null \
    | python3 -c "import sys,json; d=json.load(sys.stdin); print('ok' if isinstance(d,list) else 'not-array')" 2>/dev/null \
    || echo "ERROR")
  if [ "$result" = "ok" ]; then
    green "$label → é um array"
    ((PASS++)) || true
  else
    red "$label → não é um array ($result)"
    ((FAIL++)) || true
  fi
}

# ---------------------------------------------------------------------------
# Baseline — endpoints críticos em produção
# ---------------------------------------------------------------------------

run_baseline() {
  local base="$1"
  local label_prefix="${2:-PROD}"

  assert_status "$label_prefix CEP v1 — CEP válido"           "$base/api/cep/v1/01310100"          "200"
  assert_field  "$label_prefix CEP v1 — campo state"          "$base/api/cep/v1/01310100" "['state']" "SP"
  assert_status "$label_prefix CEP v1 — CEP inválido (7 dig)" "$base/api/cep/v1/0131010"           "400"
  assert_status "$label_prefix CEP v1 — CEP inexistente"      "$base/api/cep/v1/00000000"          "404"

  assert_status "$label_prefix CNPJ — CNPJ válido (Petrobras)" "$base/api/cnpj/v1/33000167000101"  "200"
  assert_status "$label_prefix CNPJ — CNPJ inválido"           "$base/api/cnpj/v1/00000000000000"  "404"

  assert_status   "$label_prefix Banks — lista"              "$base/api/banks/v1"     "200"
  assert_is_array "$label_prefix Banks — retorna array"      "$base/api/banks/v1"
  assert_status   "$label_prefix Banks — Nubank (260)"       "$base/api/banks/v1/260" "200"
  assert_status   "$label_prefix Banks — código inexistente" "$base/api/banks/v1/99999" "404"

  assert_status   "$label_prefix Feriados — ano válido"   "$base/api/feriados/v1/2024" "200"
  assert_is_array "$label_prefix Feriados — retorna array" "$base/api/feriados/v1/2024"

  assert_status "$label_prefix DDD — DDD válido (11)"  "$base/api/ddd/v1/11" "200"
  assert_status "$label_prefix DDD — DDD inválido (00)" "$base/api/ddd/v1/00" "400"

  assert_status "$label_prefix IBGE UF — SP"           "$base/api/ibge/uf/v1/SP" "200"
  assert_field  "$label_prefix IBGE UF — campo sigla"  "$base/api/ibge/uf/v1/SP" "['sigla']" "SP"
}

# ---------------------------------------------------------------------------
# Obtém URL de preview Vercel do PR
# ---------------------------------------------------------------------------

get_preview_url() {
  local pr="$1"
  local url
  url=$(gh pr view "$pr" --json comments 2>/dev/null \
    | python3 -c "
import sys, json, re
d = json.load(sys.stdin)
for c in d.get('comments', []):
    if c['author']['login'] != 'vercel': continue
    body = c.get('body', '')
    m = re.search(r'https?://(brasilapi[a-z0-9-]*\.vercel\.app)', body)
    if m:
        print('https://' + m.group(1))
        break
" 2>/dev/null)
  echo "$url"
}

# ---------------------------------------------------------------------------
# Agradecimento ao contributor
# ---------------------------------------------------------------------------

post_thank_you() {
  local pr="$1" author="$2"

  # Verifica se já foi agradecido para evitar duplicata
  local already_thanked
  already_thanked=$(gh pr view "$pr" --json comments 2>/dev/null \
    | python3 -c "
import sys, json
d = json.load(sys.stdin)
for c in d.get('comments', []):
    if c['author']['login'] == '$MAINTAINER' and 'obrigado' in c.get('body','').lower():
        print('yes')
        break
" 2>/dev/null || echo "")

  if [ "$already_thanked" = "yes" ]; then
    yellow "Agradecimento já enviado anteriormente — pulando"
    return
  fi

  gh pr comment "$pr" --body "Muito obrigado pela contribuição, @${author}! 🙏

Seu esforço e dedicação fazem o BrasilAPI melhor para toda a comunidade de desenvolvedores brasileiros. Fico feliz de ter você contribuindo com o projeto!" 2>/dev/null \
    && green "Agradecimento enviado para @${author}" \
    || yellow "Falha ao enviar agradecimento (não bloqueia o merge)"
}

# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------

# Coleta metadados do PR
header "PR #${PR_NUM} — Coletando metadados"

pr_data=$(gh pr view "$PR_NUM" --json title,author,state,mergeable,mergeStateStatus 2>/dev/null)
pr_title=$(echo "$pr_data" | python3 -c "import sys,json; print(json.load(sys.stdin)['title'])")
pr_author=$(echo "$pr_data" | python3 -c "import sys,json; print(json.load(sys.stdin)['author']['login'])")
pr_state=$(echo "$pr_data" | python3 -c "import sys,json; print(json.load(sys.stdin)['state'])")
pr_mergeable=$(echo "$pr_data" | python3 -c "import sys,json; print(json.load(sys.stdin)['mergeable'])")

echo "  Título:  $pr_title"
echo "  Autor:   @${pr_author}"
echo "  Estado:  $pr_state"
echo "  Merge:   $pr_mergeable"

if [ "$pr_state" != "OPEN" ]; then
  red "PR #${PR_NUM} não está aberto (state: $pr_state). Abortando."
  exit 1
fi

# Valida produção
header "Validação — Produção ($PROD)"
run_baseline "$PROD" "PROD"

# Valida preview Vercel (se existir)
PREVIEW_URL=$(get_preview_url "$PR_NUM")
if [ -n "$PREVIEW_URL" ]; then
  header "Validação — Preview Vercel ($PREVIEW_URL)"
  run_baseline "$PREVIEW_URL" "PREVIEW"
else
  yellow "Preview Vercel não encontrado nos comentários do PR — pulando validação de preview"
fi

# Resultado da validação
header "Resultado da validação"
printf "  \033[32m✓ %d passou(aram)\033[0m\n" "$PASS"
if [ "$FAIL" -gt 0 ]; then
  printf "  \033[31m✗ %d falhou(aram) — corrigir antes de mergear\033[0m\n" "$FAIL"
  echo ""
  exit 1
fi
echo ""
green "Validação concluída. Prosseguindo com o merge."

# Agradece contributor externo
if [ "$pr_author" != "$MAINTAINER" ]; then
  header "Agradecimento"
  post_thank_you "$PR_NUM" "$pr_author"
fi

# Merge
header "Merge"
gh pr merge "$PR_NUM" --squash --admin 2>&1 \
  && green "PR #${PR_NUM} mergeado com sucesso" \
  || { red "Falha no merge"; exit 1; }

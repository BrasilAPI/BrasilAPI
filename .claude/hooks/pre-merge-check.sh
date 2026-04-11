#!/usr/bin/env bash
# =============================================================================
# Hook PreToolUse — Intercepta `gh pr merge` direto
#
# Se Claude tentar rodar `gh pr merge <n>` sem passar pelo scripts/merge-pr.sh,
# este hook bloqueia e instrui a usar o script correto.
# =============================================================================

# Lê o input do tool como JSON via stdin
input=$(cat)

# Extrai o comando bash
command=$(echo "$input" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('command', ''))
except:
    print('')
" 2>/dev/null)

# Só age em chamadas `gh pr merge`
if ! echo "$command" | grep -qE 'gh pr merge'; then
  exit 0
fi

# Se o comando já vem do próprio merge-pr.sh (chamada interna), deixa passar
# O script usa `gh pr merge` com --admin no final do fluxo validado
if echo "$command" | grep -q 'merge-pr.sh\|# internal-merge'; then
  exit 0
fi

# Extrai o número do PR para dar uma mensagem útil
pr_num=$(echo "$command" | grep -oE '\b[0-9]{2,4}\b' | head -1)

cat <<EOF

⛔ gh pr merge direto interceptado.

Para mergear o PR #${pr_num:-?}, use sempre o script de merge do projeto:

  ./scripts/merge-pr.sh ${pr_num:-<pr-number>}

O script garante:
  ✓ Validação dos endpoints críticos em produção
  ✓ Validação no preview Vercel do PR
  ✓ Agradecimento automático ao contributor

EOF

exit 2

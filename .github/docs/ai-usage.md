# Uso de IA no desenvolvimento — Taskly

## Ferramentas utilizadas
- GitHub Copilot (Chat, modo @workspace) — scaffolding inicial de backend e
  frontend, guiado pelos prompts documentados em `.github/prompts/`.
- Claude (chat assistido) — revisão de conformidade do sistema, identificação de gaps e implementação de correções.

## Prompts de scaffolding
Os prompts estruturados usados para gerar a base do backend e do frontend
estão versionados em:
- `.github/prompts/backend-prompts.md`
- `.github/prompts/frontend-prompts.md`

## Sessão de revisão de conformidade
Data: 06/09/2026

| O que foi pedido | O que a IA gerou | Revisão crítica |
|---|---|---|
| Verificar conformidade do sistema | Levantamento comparando `routes/api.php`, frontend, migrations e documentação | Confirmados e documentados: Sanctum stateful, rate limiting, storage privado, binding aninhado de anexos, `APP_DEBUG` seguro e banco sem porta pública |
| Corrigir contrato de anexos | Rotas aninhadas, resources, chamadas frontend e testes de autorização/binding | Download e exclusão usam o recurso pai; usuário externo e attachment de outra tarefa são rejeitados |
| Sincronizar documentação | README raiz, backend/frontend, spec e índice `.github` | Documentação agora reflete Laravel 13, React 19, scripts reais e roteiro de evidências |

## Limitações e cuidados
- Todo código gerado por IA foi lido e testado localmente antes do commit.
- Nenhuma credencial, chave ou dado sensível foi incluído em prompts.
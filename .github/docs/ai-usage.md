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

## Sessão de revisão de conformidade (Claude)
Data: 05/09/2026

| O que foi pedido | O que a IA gerou | Revisão crítica |
|---|---|---|
| Verificar conformidade do sistema | Levantamento comparando `routes/api.php`, frontend e funcionalidades com os requisitos do anúncio | Confirmado manualmente: rota `/api/tags` existe mas não estava documentada no OpenAPI (comentário em `tags.ts` estava desatualizado); visão em lista realmente ausente no Kanban |
| Implementar toggle Lista/Kanban | Hook `useTaskViewPreference`, componentes `TaskViewToggle`/`TaskListView`, integração em `TaskManager` e `TasksPage` | Verificado que o Kanban permanece o default (não quebra `TaskManager.test.tsx` existente); teste novo adicionado para o toggle |
| Atualizar `openapi.yaml` | Doc completo com rotas de dashboard/tags/anexos de projeto | Corrigido manualmente: schema `AuthResponse` do doc original citava campo `token` que a API não retorna (auth é via cookie de sessão) — removido para não documentar um contrato inexistente |

## Limitações e cuidados
- Todo código gerado por IA foi lido e testado localmente antes do commit.
- Nenhuma credencial, chave ou dado sensível foi incluído em prompts.
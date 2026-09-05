# Prompts de Desenvolvimento Frontend (Taskly)

## Prompt 2.1: Analisar e Preparar a Arquitetura
@workspace Analise o frontend em `frontend/` e a API em `backend/docs/openapi.yaml`. Siga #file:copilot-instructions.md e #file:architecture.md.
Antes de gerar código:
- Explique brevemente a arquitetura proposta.
- Identifique o que já existe e deve ser preservado (ex: verificação de health check).
- Liste os pacotes para React Router, Axios, TanStack Query v5 e validação de formulários.
- Apenas proponha o plano, sem alterar arquivos nesta etapa.

## Prompt 2.2: Configurar a Fundação do Frontend
@workspace Implemente a fundação do frontend Taskly:
- Instale e configure Axios e TanStack Query v5 (QueryClient global).
- Configure o React Router com cliente HTTP central em `src/api/` lendo de `src/config/env.ts`.
- Implemente tratamento tipado de erros HTTP (401, 403, 422, 500).
- Não use `fetch` diretamente e proíba `any`.
- Execute `npm run build` e `npm run lint` ao final e reporte alterações.

## Prompt 2.3: Criar Tipos Globais da API
@workspace Crie os tipos TypeScript em `frontend/src/types/` baseando-se em `backend/docs/openapi.yaml` e `routes/api.php`:
- Interfaces para `User`, Auth, `Project`, `Task`, `TaskStatus`, `Attachment` e respostas paginadas/envelopadas.
- Helpers e labels tipados para `TaskStatus`: `pending` ("Não iniciada"), `in_progress` ("Em andamento"), `completed` ("Concluída"), `cancelled` ("Cancelada").
- Sem uso de `any` ou `casts` desnecessários. Valide com `npm run build` e `npm run lint`.

## Prompt 2.4: Implementar Autenticação
@workspace Implemente o fluxo de autenticação conforme #file:copilot-instructions.md:
- Telas de Login e Cadastro com tratamento de erros de validação (422).
- Custom hooks: `useLogin`, `useRegister`, `useCurrentUser` e `useLogout` encapsulando chamadas de `src/api/`.
- Armazenamento de token/sessão Sanctum, proteção de rotas públicas/privadas no React Router.
- Invalidação de queries no TanStack Query no logout. Valide com `npm run build` e `npm run lint`.

## Prompt 2.5: Layout Principal e Shell Autenticado
@workspace Crie o layout autenticado e responsivo do Taskly utilizando Tailwind CSS:
- Componentes de Sidebar/Navegação, Header, perfil do usuário e botão de Logout.
- Componentes reutilizáveis para Feedback Visual: Skeletons (loading), Error Alert e Empty State.
- Mantenha responsabilidade única nos componentes e não coloque regras de negócio dentro das views. Valide com `npm run build`.

## Prompt 2.6: CRUD e Hooks de Projetos
@workspace Implemente a gestão de Projetos integrada à API REST:
- Custom hooks em `src/hooks/`: `useProjects`, `useProject`, `useCreateProject`, `useUpdateProject` e `useDeleteProject`.
- Endpoints `/api/projects` e `/api/projects/{project}` com revalidação consistente de cache via TanStack Query.
- Modais ou telas de criação/edição/exclusão com confirmação. Valide com `npm run build` e `npm run lint`.

## Prompt 2.7: Gestão e Quadro de Tarefas
@workspace Implemente a gestão de Tarefas de um projeto:
- Custom hooks para listar, criar, editar, excluir e alterar ordem (`position`).
- Endpoint rápido `PATCH /api/tasks/{task}/status` para transição do Kanban/Status.
- Form com validação para título, descrição, prazo, tags e status usando os helpers de status criados.
- Reorganização e exibição visual agrupada por status. Valide com `npm run build` e `npm run lint`.

## Prompt 2.8: Integração de Tags
@workspace Analise os endpoints de Tags disponíveis em `routes/api.php`:
- Crie tipos, funções em `src/api/` e custom hooks em `src/hooks/`.
- Adicione o componente de seleção/desseleção de tags no formulário de tarefas com renderização de cores badge.
- Se a API não possuir rotas dedicadas de tags, desacople a interface mantendo-a pronta para consumo. Valide com `npm run build`.

## Prompt 2.9: Upload de Anexos
@workspace Implemente a gestão de anexos das tarefas conforme `backend/docs/openapi.yaml`:
- Upload multipart/form-data para `POST /api/tasks/{task}/attachments` e exclusão em `DELETE /api/attachments/{attachment}`.
- Garanta que o Axios ajuste automaticamente os headers de boundary sem forçar `application/json`.
- Exibição de lista de arquivos (nome, tipo, tamanho formatado em KB/MB) e indicador de upload. Valide com `npm run build` e `npm run lint`.

## Prompt 3.0: Dashboard Resumo
@workspace Crie a tela principal de Dashboard do Taskly:
- Visão consolidada: métricas de tarefas por status, tarefas próximas do vencimento e projetos recentes.
- Uso exclusivo de dados vindos dos custom hooks (sem dados estáticos ou chamadas diretas de API na view).
- Tratamento com Skeletons durante a busca inicial. Valide com `npm run build` e `npm run lint`.

## Prompt 3.1: Qualidade, Acessibilidade e Refatoração
@workspace Faça uma auditoria geral de código no `frontend/` com base em #file:copilot-instructions.md:
- Confirme 0% de tipo `any`, 0% de `fetch` nativo e 100% de chamadas via custom hooks/`src/api/`.
- Verifique tratamento visual correto de HTTP 401, 403, 404 e 422.
- Melhore acessibilidade (navegação por teclado, atributos ARIA, labels em inputs).
- Execute `npm run build` e `npm run lint` e corrija todas as pendências listadas no terminal.

## Prompt 3.2: Testes do Frontend
@workspace Analise o executor de testes configurado (Vitest / React Testing Library):
- Implemente testes de integração cobrindo: fluxo de Login, proteção de rotas privadas, renderização da lista de projetos e alternância de status de tarefa.
- Sem mocks vazios ou assertions irrelevantes.
- Execute a suíte de testes juntamente com `npm run build` e `npm run lint`.
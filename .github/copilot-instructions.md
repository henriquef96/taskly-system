# Instruções de Desenvolvimento: Taskly

## Arquitetura

### Backend
- PHP 8.4+
- Laravel 11+
- PostgreSQL
- API REST
- Laravel Sanctum (Autenticação SPA / API Tokens)

### Frontend
- React 18+
- TypeScript (Tipagem forte obrigatória, proibidas declarações com `any`)
- Tailwind CSS
- Vite
- State / Query Management: React Query / TanStack Query ou Axios + React Context

### Infraestrutura
- Docker / Docker Compose

---

## Princípios de Desenvolvimento

O código deve seguir rigorosamente:
- SOLID
- Clean Code
- DRY
- KISS
- Separation of Concerns
- Single Responsibility Principle

### Regras
- Manter responsabilidades bem separadas.
- Controllers devem ser simples e não conter regras complexas de negócio.
- Regras de negócio devem ficar em **Services** ou **Actions** quando necessário.
- Utilizar **Form Requests** para validação das entradas no backend.
- Utilizar **Policies/Gates** para autorização de acesso a recursos (garantir que usuários só acessem seus próprios projetos/tarefas).
- Evitar duplicação de código.
- Preferir soluções simples em vez de overengineering.
- Criar código legível, testável e de fácil manutenção.
- Não criar abstrações, classes ou dependências sem necessidade real.
- Nunca confiar exclusivamente no frontend para validação ou segurança.
- Nunca expor credenciais, tokens ou informações sensíveis.
- O frontend deve consumir o backend exclusivamente através da API REST.
- Utilizar TypeScript com tipagem forte e evitar `any`.

---

## Processo de Trabalho do GitHub Copilot

Antes de gerar ou alterar código:
1. Explicar cada passo da implementação antes de gerar o código.
2. Verificar a estrutura existente do projeto.
3. Respeitar os padrões e princípios definidos neste documento.
4. Reutilizar código existente quando possível.
5. Evitar alterações desnecessárias em partes que já funcionam.
6. Priorizar simplicidade, segurança, legibilidade e testabilidade.

---

## ESCOPO DA APLICAÇÃO (Taskly)

Consiste em um gerenciador pessoal de tarefas nomeado Taskly. O sistema contempla um fluxo de autenticação local (e-mail/senha) sem dependência externa, permitindo o agrupamento de demandas em projetos distintos e o controle individualizado de tarefas associadas a cada contexto.

### 1. Modelagem de Dados & PostgreSQL (Migrations)

#### `users`
- `id` (bigint / uuid)
- `name` (string)
- `email` (string, unique)
- `password` (string, hashed)
- `timestamps`

#### `projects`
- `id` (bigint / uuid)
- `user_id` (foreign key -> `users.id`, cascade on delete)
- `name` (string)
- `description` (text, nullable)
- `timestamps`

#### `tasks`
- `id` (bigint / uuid)
- `project_id` (foreign key -> `projects.id`, cascade on delete)
- `title` (string)
- `short_description` (string, max: 255)
- `full_description` (text / longText, nullable)
- `due_date` (timestamp/datetime com hora, nullable)
- `status` (enum ou string: `'pending'`, `'in_progress'`, `'completed'`, `'cancelled'`)
  - Labels de exibição: `"Não iniciada"`, `"Em andamento"`, `"Concluída"`, `"Cancelada"`
- `position` (integer, default 0 - ordenação visual)
- `timestamps`

#### `tags` & `task_tag`
- `tags`: `id`, `name`, `color`
- Pivot `task_tag`: `task_id`, `tag_id`

#### `task_attachments`
- `id` (bigint / uuid)
- `task_id` (foreign key -> `tasks.id`, cascade)
- `file_path`, `file_name`, `mime_type`, `file_size`
- `timestamps`

---

## 🛠 Passos de Implementação

### Passo 1: Autenticação Própria (Laravel Sanctum + React)
- Endpoints REST: `POST /api/register`, `POST /api/login`, `GET /api/me`, `POST /api/logout`.
- Sessão persistente (cookie via Sanctum ou Bearer token armazenado de forma segura).
- Interfaces de Login e Cadastro no React com validação.

### Passo 2: Módulo de Projetos
- `ProjectController` usando CRUD RESTful (`index`, `store`, `show`, `update`, `destroy`).
- Garantir isolamento usando Policy (`ProjectPolicy` -> `auth()->user()->id === $project->user_id`).
- Sidebar no Frontend listando projetos e botão para criação de novo projeto.

### Passo 3: Módulo de Tarefas & Edição Completa
- `TaskController` sob o escopo do projeto ativo (`/api/projects/{project}/tasks`).
- Validações em `StoreTaskRequest` e `UpdateTaskRequest`.
- Todos os campos são editáveis após a criação (`title`, `short_description`, `full_description`, `due_date`, `tags`, `attachments`).
- Upload de anexos gerenciado via `Storage` do Laravel.

### Passo 4: Alternância de Visões (Lista e Kanban)
- Componente de Toggle no Frontend: estado local ou `localStorage` para chavear entre visão **Lista** e **Kanban**.
- **Lista:** Tabela/Lista responsiva exibindo resumo da tarefa, tag, prazo e status.
- **Kanban:** 4 colunas mapeadas por status (`Não iniciada`, `Em andamento`, `Concluída`, `Cancelada`). Mudança de status via interatividade de arrastar/soltar ou menu rápido no card.

### Passo 5: Módulo de Status e Anexos
- Endpoint leve para atualização de status: `PATCH /api/tasks/{task}/status`.
- Endpoints de upload e remoção de anexos: `POST /api/tasks/{task}/attachments` e `DELETE /api/attachments/{attachment}`.

### Testes e documentação da API
- Os testes de integração da API ficam em `backend/tests/Feature/Api`.
- Execute-os com `docker compose exec app php artisan test`; a saída deve usar descrições legíveis via TestDox.
- Não manter testes de exemplo ou testes que apenas validem `true`; cada teste deve verificar um fluxo real da API com mensagens de asserção explicativas.
- Para testes manuais, usar Postman com `Accept: application/json`, autenticar via `/api/register` ou `/api/login` e enviar o token como `Authorization: Bearer <token>`.
- A visualização Swagger UI fica em `http://localhost:8080/docs`, e o contrato OpenAPI em `http://localhost:8080/docs/openapi.yaml`.
# Prompts de Desenvolvimento Backend (Taskly)

## Prompt 1.1: Migrations e Models
@workspace Siga as instruções de #file:copilot-instructions.md. Vamos iniciar a implementação do backend. Analise a estrutura atual do projeto e me explique o passo a passo. Crie as migrations e models para os recursos Project, Task, Tag e TaskAttachment, além da tabela pivot task_tag. Garanta chaves estrangeiras com `cascadeOnDelete`, tipos de dados corretos, `$fillable` e `$casts` nos models conforme #file:database.md.

## Prompt 1.2: Factories e Seeders
@workspace Siga o fluxo de #file:copilot-instructions.md. Explique os passos e implemente os Factories e Seeders para os models User, Project, Task, Tag e TaskAttachment. Precisamos de dados de teste coerentes para validar as respostas da API e a paginação nos próximos passos.

## Prompt 1.3: Autenticação (Laravel Sanctum)
@workspace Siga as instruções de #file:copilot-instructions.md. Vamos implementar a Autenticação. Explique o passo a passo antes do código. Crie os Form Requests para validação de entrada (`RegisterRequest` e `LoginRequest`) com regras estritas.

## Prompt 1.4: AuthController e Rotas
@workspace Implemente o `AuthController` contendo as ações `register`, `login`, `me` e `logout`. Mantenha o controller extremamente magro (*thin controller*), utilizando `UserResource` para o retorno dos dados do usuário. Registre as rotas correspondentes no arquivo `routes/api.php`.

## Prompt 1.5: Policy, Form Requests e Service de Projetos
@workspace Vamos implementar a estrutura de Projetos. Explique a arquitetura da solução antes.
- Crie a `ProjectPolicy` garantindo isolamento por `user_id`.
- Crie `StoreProjectRequest` e `UpdateProjectRequest`.
- Crie a camada `ProjectService` para isolar as regras de negócio.
- Crie o `ProjectResource`.

## Prompt 1.6: ProjectController e Rotas RESTful
@workspace Implemente o `ProjectController` (métodos `index`, `store`, `show`, `update` e `destroy`) retornando `ProjectResource` ou `ProjectResource::collection` com paginação. Proteja os endpoints via middleware Sanctum em `routes/api.php` e vincule as autorizações da `ProjectPolicy`.

## Prompt 1.7: Task Policy, Form Requests e TaskResource
@workspace Explique os passos da solução para o recurso de Tarefas.
- Crie a `TaskPolicy` verificando se a tarefa pertence a um projeto do usuário autenticado.
- Crie `StoreTaskRequest` e `UpdateTaskRequest` validando campos, enums (`pending`, `in_progress`, `completed`, `cancelled`) e vínculo com tags.
- Crie o `TaskResource` formatando datas e exibindo os labels de status correspondentes ("Não iniciada", "Em andamento", etc.).

## Prompt 1.8: TaskController e TaskService
@workspace Implemente o `TaskController` sob o escopo do projeto (`/api/projects/{project}/tasks`).
Utilize o `TaskService` para lidar com a persistência e sincronização de tags (`sync`). Inclua o endpoint específico `PATCH /api/tasks/{task}/status` para alteração rápida de status no Kanban.

## Prompt 1.9: Upload e Gestão de Anexos
@workspace Implemente os endpoints de upload e exclusão de anexos de tarefas:
- `POST /api/tasks/{task}/attachments`
- `DELETE /api/attachments/{attachment}`
Crie o `UploadAttachmentRequest` validando mime-types e limites de tamanho. Trate o armazenamento via `Storage` facade e persista os metadados em `task_attachments`.
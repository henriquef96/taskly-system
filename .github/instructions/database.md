# Esquema e Modelagem de Dados: Taskly

## Escopo do Domínio
Gerenciador pessoal de tarefas com autenticação local, organização por projetos, prazos, tags e anexos.

---

## Modelos de Dados (PostgreSQL / Migrations)

### 1. `users`
- `id`: bigint / uuid (Primary Key)
- `name`: string
- `email`: string (unique)
- `password`: string (hashed)
- `timestamps`

### 2. `projects`
- `id`: bigint / uuid (Primary Key)
- `user_id`: FK -> `users.id` (cascade delete)
- `name`: string
- `description`: text (nullable)
- `timestamps`

### 3. `tasks`
- `id`: bigint / uuid (Primary Key)
- `project_id`: FK -> `projects.id` (cascade delete)
- `title`: string
- `short_description`: string (max: 255)
- `full_description`: text (nullable)
- `due_date`: timestamp com fuso/hora (nullable)
- `status`: enum (`'pending'`, `'in_progress'`, `'completed'`, `'cancelled'`)
  - *Mapeamento para Rótulos Frontend:*
    - `'pending'` -> `"Não iniciada"`
    - `'in_progress'` -> `"Em andamento"`
    - `'completed'` -> `"Concluída"`
    - `'cancelled'` -> `"Cancelada"`
- `position`: integer (default: 0 - ordenação visual/Kanban)
- `timestamps`

### 4. `tags` & `task_tag` (M:N)
- **`tags`**:
  - `id`: bigint / uuid (Primary Key)
  - `user_id`: FK -> `users.id` (cascade delete)
  - `name`: string
  - `color`: string (hex/code)
- **Pivot `task_tag`**:
  - `task_id`: FK -> `tasks.id` (cascade delete)
  - `tag_id`: FK -> `tags.id` (cascade delete)

### 5. `task_attachments`
- `id`: bigint / uuid (Primary Key)
- `task_id`: FK -> `tasks.id` (cascade delete)
- `file_path`: string
- `file_name`: string
- `mime_type`: string
- `file_size`: integer (bytes)
- `timestamps`
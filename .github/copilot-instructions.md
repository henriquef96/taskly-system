# Instruções de Desenvolvimento: Taskly

## Arquitetura & Stack

### Backend
- PHP 8.4+ | Laravel 11+ | PostgreSQL
- API REST documentada/testada
- Autenticação: Laravel Sanctum (SPA / API Tokens)
- Padronização de Resposta: SEMPRE utilizar Laravel API Resources (`JsonResource`) para retornos JSON.

### Frontend
- React 18+ | TypeScript (Tipagem estrita) | Vite | Tailwind CSS
- Gerenciamento de Estado/Query: TanStack Query (React Query) v5 + Axios
- Organização: Tipos globais e interfaces da API em `src/types/`. Chamadas de API encapsuladas em custom hooks em `src/hooks/`.

### Infraestrutura
- Docker / Docker Compose

---

## Regras e Princípios do Código

### Backend (Laravel)
- **Controllers:** Devem ser extremamente diretos (*thin controllers*). Responsáveis apenas por receber a requisição, chamar a camada de ação/serviço e retornar a resposta.
- **Validação:** OBLIGATÓRIO utilizar `Form Request` para qualquer criação ou atualização.
- **Regras de Negócio:** Colocar em **Services** ou **Single-Action Classes (Actions)**.
- **Autorização:** OBLIGATÓRIO utilizar `Policies` em todas as rotas de recursos para garantir o isolamento de dados entre usuários (`user_id`).
- **NUNCA** confiar no frontend para validação de segurança ou integridade dos dados.

### Frontend (React + TS)
- **PROIBIDO** o uso do tipo `any`. Crie interfaces ou types explicitamente.
- **Componentes:** Devem ter responsabilidade única e visual limpo.
- **Comunicação:** O frontend consome a aplicação estritamente via API REST.
- **Segurança:** NUNCA expor credenciais, chaves privadas ou tokens no código do cliente.

---

## Processo de Trabalho do GitHub Copilot

Antes de propor ou gerar código:
1. **Planejamento:** Explique sucintamente a abordagem antes de implementar.
2. **Checagem:** Analise a estrutura e os arquivos já existentes no projeto para reutilizar padrões, rotas e componentes.
3. **Preservação:** Não altere métodos ou comportamentos que já funcionam, a menos que solicitado explicitamente.
4. **Qualidade:** Dê preferência a soluções simples (KISS), testáveis e limpas (Clean Code / DRY).

---

## Escopo e Modelagem do Domínio (Taskly)

Gerenciador pessoal de tarefas com autenticação local (e-mail/senha), organização por projetos, prazos e anexos.

### Modelos de Dados (PostgreSQL / Migrations)

- **`users`**: `id` (bigint/uuid), `name`, `email` (unique), `password` (hashed), `timestamps`.
- **`projects`**: `id`, `user_id` (FK -> `users.id`, cascade), `name`, `description` (nullable), `timestamps`.
- **`tasks`**:
  - `id`, `project_id` (FK -> `projects.id`, cascade)
  - `title` (string)
  - `short_description` (string, max: 255)
  - `full_description` (text, nullable)
  - `due_date` (timestamp com hora, nullable)
  - `status` (enum: `'pending'`, `'in_progress'`, `'completed'`, `'cancelled'`)
    - *Labels frontend:* `"Não iniciada"`, `"Em andamento"`, `"Concluída"`, `"Cancelada"`
  - `position` (integer, default: 0 - ordenação visual)
  - `timestamps`
- **`tags` & `task_tag`**: 
  - `tags`: `id`, `user_id` (FK -> `users.id`, cascade), `name`, `color`
  - Pivot `task_tag`: `task_id`, `tag_id`
- **`task_attachments`**: `id`, `task_id` (FK -> `tasks.id`, cascade), `file_path`, `file_name`, `mime_type`, `file_size`, `timestamps`.

---

## Testes e Qualidade

- **Backend Tests:** Toda nova funcionalidade deve acompanhar seu respectivo teste de integração/Feature (`Pest` ou `PHPUnit`).
- **Execução:** Testes são validados via Docker: `docker compose exec app php artisan test`.
- **Qualidade dos Testes:** PROIBIDO manter testes vazios, mocks irrelevantes ou asserções como `assertTrue(true)`. Os testes devem validar fluxos reais de API e regras de autorização/Policy.
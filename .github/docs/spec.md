# Taskly — Spec Técnica

## 1. Domínio

Gerenciador de tarefas com autenticação, projetos, tarefas, status, tags,
prazos e anexos privados.

## 2. Stack

- Backend: PHP 8.4, Laravel 13, PostgreSQL e Sanctum.
- Frontend: React 19, TypeScript, Vite, TanStack Query e Tailwind CSS.
- Infraestrutura: Docker Compose, PHP-FPM e Nginx.

## 3. Contrato de API

O contrato está em `backend/docs/openapi.yaml` e é servido em `/docs`.
Autenticação é stateful por sessão/cookie Sanctum e CSRF; não há token Bearer.
Downloads de anexos usam binding aninhado:

```text
/api/tasks/{task}/attachments/{attachment}/download
/api/projects/{project}/attachments/{attachment}/download
```

## 4. Dados

O modelo está detalhado em `.github/instructions/database.md`. Tags pertencem
a um usuário; projetos, tarefas e anexos são protegidos por relacionamento e
Policies.

## 5. UX

- Dashboard com visão geral.
- Alternância Lista/Kanban persistida em localStorage.
- Tickets numerados para rastreabilidade.
- Anexos disponíveis na Lista, Kanban e edição/detalhe.
- Login e cadastro responsivos.

## 6. Segurança e operação

- Rate limiting em login, cadastro e troca de senha.
- Storage privado para anexos.
- `APP_DEBUG=false` fora do desenvolvimento local.
- Secrets fornecidos por ambiente/secret manager.
- PostgreSQL sem porta pública no Compose.
- Migrations executadas com `php artisan migrate --force`.

## 7. Testes

A estratégia está em `.github/instructions/testing.md`. A entrega deve validar
backend, frontend, autorização, binding e contratos de API.

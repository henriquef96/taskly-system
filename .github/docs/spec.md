# Taskly — Spec Técnica

## 1. Domínio
Gerenciador pessoal de tarefas: autenticação própria, projetos, tarefas com
status, tags e anexos. Escopo completo em `.github/instructions/database.md`.

## 2. Stack
Backend: Laravel 13 + PostgreSQL + Sanctum.
Frontend: React 19 + TypeScript + TanStack Query v5 + Tailwind v4.
Ver `.github/instructions/architecture.md` para as regras de código aplicadas
(thin controllers, Form Requests, Services, Policies).

## 3. Contrato de API
Especificação completa em `backend/docs/openapi.yaml`, servida via Swagger UI
em `/docs`. Cobre auth, dashboard, projetos, tarefas, tags e anexos.

## 4. Modelo de dados
Definido em `.github/instructions/database.md`.

## 5. Decisões de UX além do mock de referência
- Dashboard com visão geral dos projetos e tarefas.
- Toggle Lista/Kanban persistido em localStorage.
- Numeração de tickets (PJT-001/TRF-001) para rastreabilidade visual.
- Configuração para troca/reset de senha.

## 6. Testes
Estratégia em `.github/instructions/testing.md`.
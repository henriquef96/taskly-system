# Taskly

Aplicação full-stack para organização de projetos, tarefas, tags, prazos e
anexos privados.

## Stack

- **Backend:** PHP 8.4, Laravel 13, PostgreSQL e Laravel Sanctum.
- **Frontend:** React 19, TypeScript 6, Vite 8, Tailwind CSS 4 e TanStack Query 5.
- **Infraestrutura:** Docker Compose, PHP-FPM e Nginx.

## Estrutura

```text
backend/                 API Laravel, migrations e testes PHPUnit
frontend/                SPA React, componentes, hooks e testes Vitest
docker/nginx/             Configuração do proxy/web server
.github/instructions/     Regras de arquitetura, dados e testes
.github/docs/             Spec, uso de IA e evidências do case
.github/prompts/          Prompts versionados de backend e frontend
docker-compose.yml        Ambiente local integrado
```

## Executar localmente

Requisitos: Docker e Docker Compose.

```bash
copy backend\.env.example backend\.env
docker compose up --build
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate --seed
```

URLs locais:

- Frontend: <http://localhost:5173>
- API: <http://localhost:8080>
- Swagger UI: <http://localhost:8080/docs>
- OpenAPI bruto: <http://localhost:8080/docs/openapi.yaml>

## Autenticação e API

A API usa Sanctum stateful com sessão/cookie e proteção CSRF. Não há token Bearer
no contrato atual. O frontend inicializa `/sanctum/csrf-cookie` antes de login
ou cadastro e consulta `/api/me`; respostas `401` representam visitante não
autenticado.

Principais grupos:

- `POST /api/register`, `POST /api/login`, `POST /api/logout`
- `GET /api/me`, `PATCH /api/password`
- Projetos, tarefas, dashboard e tags
- Upload e download privado de anexos

Downloads usam binding aninhado e autorização:

```text
/api/tasks/{task}/attachments/{attachment}/download
/api/projects/{project}/attachments/{attachment}/download
```

Login, cadastro e troca de senha possuem rate limiting. Policies garantem
isolamento entre usuários.

## Testes e qualidade

Backend:

```bash
docker compose exec app php artisan test
docker compose exec app vendor/bin/pint --test
```

Frontend:

```bash
cd frontend
npm ci
npm run build
npm run lint
npm run test
```

O build do frontend executa a checagem TypeScript antes do bundle. Os testes
backend usam SQLite em memória conforme `phpunit.xml`.

## Documentação de engenharia

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
- [Spec do produto](.github/docs/spec.md)
- [Uso de IA](.github/docs/ai-usage.md)
- [Evidências de apresentação](.github/docs/presentation-evidence.md)
- [OpenAPI](backend/docs/openapi.yaml)
- [Instruções do projeto](.github/copilot-instructions.md)

# Taskly Backend

API REST do Taskly, construída com PHP 8.4, Laravel 13, PostgreSQL e Sanctum.
O frontend usa autenticação stateful por sessão/cookie.

## Desenvolvimento

Na raiz do repositório:

```bash
copy backend\.env.example backend\.env
docker compose up --build
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate --seed
```

Endpoints locais:

- API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/docs`
- OpenAPI: `http://localhost:8080/docs/openapi.yaml`

## Configuração

`APP_DEBUG` deve permanecer `false` fora do desenvolvimento local. Em produção:

- configure `APP_URL` com HTTPS;
- forneça `APP_KEY`, `DB_PASSWORD` e demais segredos por secret manager;
- ajuste `SANCTUM_STATEFUL_DOMAINS` para as origens reais;
- não publique a porta do PostgreSQL;
- execute migrations com `php artisan migrate --force`.

Anexos ficam no storage privado e só são acessíveis através de endpoints
autorizados. A migration de escopo de tags interrompe a execução quando dados
legados não podem ser atribuídos com segurança a um único usuário.

## Contrato da API

A autenticação não retorna token Bearer. O fluxo é:

1. `GET /sanctum/csrf-cookie`;
2. `POST /api/login` ou `POST /api/register`;
3. manter os cookies de sessão e CSRF nas requisições seguintes.

Rotas relevantes:

- `GET /api/me`, `POST /api/logout`, `PATCH /api/password`;
- CRUD de `/api/projects`;
- CRUD aninhado de `/api/projects/{project}/tasks`;
- `GET /api/dashboard` e `GET /api/tags`;
- anexos de projeto e tarefa com upload, download e exclusão.

Login, cadastro e troca de senha têm rate limiting. Policies e scoped bindings
impedem acesso cruzado entre usuários ou entre recursos pai e filho.

## Testes

```bash
docker compose exec app php artisan test
docker compose exec app vendor/bin/pint --test
```

Ao alterar endpoint, request, policy, migration ou contrato de anexo, atualize
os testes de integração e `docs/openapi.yaml`.

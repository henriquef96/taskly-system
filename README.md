# taskly-system

Projeto Full-Stack de acompanhamento e gerenciamento de atividades.

Backend: Laravel (API REST) + PostgreSQL.
Frontend: React + TypeScript + Tailwind CSS + Vite.
Infraestrutura: Container Docker, Docker Compose.

## Estrutura

.
├── backend/ # API Laravel (PHP 8.4+)
├── frontend/ # SPA React + TypeScript + Tailwind CSS (Vite)
├── docker/nginx/ # Configuração do Nginx usada pelo docker-compose
├── docker-compose.yml # Orquestração dos serviços (app, frontend, nginx, postgres)
└── .github/copilot-instructions.md # Diretrizes de desenvolvimento do projeto


## Como rodar

```bash
docker compose up -d --build
docker compose exec app php artisan migrate
```

A API fica disponível em `http://localhost:8080`. A documentação interativa Swagger UI está em `http://localhost:8080/docs`.
O frontend fica disponível em `http://localhost:5173`.

## Testes da API

Execute a suíte de integração dentro do backend:

```bash
docker compose exec app php artisan test
```

Os testes usam SQLite em memória e cobrem cadastro, login, autenticação, isolamento de projetos e o ciclo de vida de tarefas.

### Testando pelo Postman

A autenticação da API é feita via **Laravel Sanctum no modo stateful (SPA)**: não há emissão de token Bearer, o login/registro autentica por **cookie de sessão** protegido por **CSRF**. Para testar pelo Postman:

1. Inicie o ambiente com `docker compose up -d --build`.
2. No Postman, habilite o gerenciamento automático de cookies (cookie jar) para o domínio `localhost`.
3. Faça `GET http://localhost:8080/sanctum/csrf-cookie`. Essa chamada grava os cookies `XSRF-TOKEN` (CSRF) e `taskly-system-session` (sessão).
4. Garanta que a requisição envie o header `X-XSRF-TOKEN` com o valor do cookie `XSRF-TOKEN` (o Postman preenche isso automaticamente quando "Send cookies automatically" está habilitado; caso contrário, copie o valor do cookie manualmente).
5. Crie uma requisição `POST http://localhost:8080/api/register` com `Content-Type: application/json`, `Accept: application/json` e o corpo:

```json
{
  "name": "Ana Silva",
  "email": "ana@example.com",
  "password": "Senha@123",
  "password_confirmation": "Senha@123"
}
```

A resposta contém apenas `{ "user": {...} }` — **não há campo `token`**; a sessão já fica autenticada via cookie a partir deste momento.

6. Nas requisições protegidas (`GET /api/me`, `GET /api/projects`, `POST /api/projects` e os endpoints de tarefas descritos no Swagger), mantenha os cookies da etapa anterior e o header `X-XSRF-TOKEN` — **não utilize `Authorization: Bearer`**.

Também é possível autenticar via `POST /api/login` usando `email` e `password` (repita o passo 3 antes, caso o cookie CSRF/sessão já tenha expirado ou sido limpo).

### Acessando o Swagger UI

Com o backend em execução, abra `http://localhost:8080/docs` no navegador. A tela permite consultar os endpoints, visualizar os schemas e executar requisições autenticadas: como a autenticação é por cookie de sessão, basta primeiro chamar `/sanctum/csrf-cookie` e depois `/api/login` (ou `/api/register`) diretamente pela própria interface do Swagger UI, que compartilha os cookies do navegador. A especificação bruta está em `http://localhost:8080/docs/openapi.yaml`.

## Convenções do backend

Seguindo `.github/copilot-instructions.md`:

- **Controllers**: finos, sem regra de negócio; apenas orquestram request → service/model → response.
- **Services** (`app/Services`): concentram regras de negócio, criados apenas quando a lógica deixa de ser trivial (evitar abstração prematura).
- **Form Requests** (`app/Http/Requests`): validação de entrada, nunca feita direto no controller.
- **Policies/Gates** (`app/Policies`): autorização de ações sobre os models.
- Rotas de API ficam em `backend/routes/api.php`.
- A especificação OpenAPI fica em [`backend/docs/openapi.yaml`](backend/docs/openapi.yaml) e é servida também em `GET /docs/openapi.yaml`.

## Convenções do frontend

Ver detalhes em [`frontend/README.md`](frontend/README.md). Resumo:

- Toda comunicação com o backend passa pelo cliente HTTP em `frontend/src/api` — consumo exclusivo via API REST.
- TypeScript com tipagem forte, sem `any`.
- Estilização via Tailwind CSS (utilitários), sem CSS customizado desnecessário.
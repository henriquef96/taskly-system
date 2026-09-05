# taskly-system

Projeto Full-Stack de acompanhamento e gerenciamento de atividades.

Backend: Laravel (API REST) + PostgreSQL.
Frontend: React + TypeScript + Tailwind CSS + Vite.
Infraestrutura: Container Docker, Docker Compose.

## Estrutura

```
.
├── backend/            # API Laravel (PHP 8.4+)
├── frontend/            # SPA React + TypeScript + Tailwind CSS (Vite)
├── docker/nginx/        # Configuração do Nginx usada pelo docker-compose
├── docker-compose.yml   # Orquestração dos serviços (app, frontend, nginx, postgres)
└── .github/copilot-instructions.md  # Diretrizes de desenvolvimento do projeto
```

## Como rodar

```bash
docker compose up -d --build
deocker compose install
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

1. Inicie o ambiente com `docker compose up -d --build`.
2. Crie uma requisição `POST http://localhost:8080/api/register` com `Content-Type: application/json` e o corpo:

```json
{
  "name": "Ana Silva",
  "email": "ana@example.com",
  "password": "Senha@123",
  "password_confirmation": "Senha@123"
}
```
3. Copie o valor `token` da resposta.
4. Nas requisições protegidas, use `Authorization: Bearer <token>` e `Accept: application/json`.
5. Teste `GET /api/me`, `GET /api/projects`, `POST /api/projects` e os endpoints de tarefas descritos no Swagger.

Também é possível autenticar via `POST /api/login` usando `email` e `password`.

### Acessando o Swagger UI

Com o backend em execução, abra `http://localhost:8080/docs` no navegador. A tela permite consultar os endpoints, visualizar os schemas e usar **Authorize** para informar `Bearer <token>` e executar requisições autenticadas. A especificação bruta está em `http://localhost:8080/docs/openapi.yaml`.

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

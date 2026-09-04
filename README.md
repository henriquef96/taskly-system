# taskly-system

Base do projeto full-stack: backend em Laravel (API REST) + PostgreSQL e frontend em React + TypeScript + Tailwind CSS + Vite, com infraestrutura via Docker Compose.

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
docker compose exec app php artisan migrate
```

A API fica disponível em `http://localhost:8080`. Health-check: `GET /api/health`.
O frontend fica disponível em `http://localhost:5173`.

## Convenções do backend

Seguindo `.github/copilot-instructions.md`:

- **Controllers**: finos, sem regra de negócio; apenas orquestram request → service/model → response.
- **Services** (`app/Services`): concentram regras de negócio, criados apenas quando a lógica deixa de ser trivial (evitar abstração prematura).
- **Form Requests** (`app/Http/Requests`): validação de entrada, nunca feita direto no controller.
- **Policies/Gates** (`app/Policies`): autorização de ações sobre os models.
- Rotas de API ficam em `backend/routes/api.php`.

## Convenções do frontend

Ver detalhes em [`frontend/README.md`](frontend/README.md). Resumo:

- Toda comunicação com o backend passa pelo cliente HTTP em `frontend/src/api` — consumo exclusivo via API REST.
- TypeScript com tipagem forte, sem `any`.
- Estilização via Tailwind CSS (utilitários), sem CSS customizado desnecessário.

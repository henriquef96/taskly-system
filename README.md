# ia-system

Base do projeto full-stack: backend em Laravel (API REST) + PostgreSQL, com infraestrutura via Docker Compose. O frontend (React + TypeScript + Tailwind + Vite) será adicionado posteriormente em `frontend/`.

## Estrutura

```
.
├── backend/            # API Laravel (PHP 8.4+)
├── docker/nginx/        # Configuração do Nginx usada pelo docker-compose
├── docker-compose.yml   # Orquestração dos serviços (app, nginx, postgres)
└── .github/copilot-instructions.md  # Diretrizes de desenvolvimento do projeto
```

## Como rodar

```bash
docker compose up -d --build
docker compose exec app php artisan migrate
```

A API fica disponível em `http://localhost:8080`. Health-check: `GET /api/health`.

## Convenções do backend

Seguindo `.github/copilot-instructions.md`:

- **Controllers**: finos, sem regra de negócio; apenas orquestram request → service/model → response.
- **Services** (`app/Services`): concentram regras de negócio, criados apenas quando a lógica deixa de ser trivial (evitar abstração prematura).
- **Form Requests** (`app/Http/Requests`): validação de entrada, nunca feita direto no controller.
- **Policies/Gates** (`app/Policies`): autorização de ações sobre os models.
- Rotas de API ficam em `backend/routes/api.php`.

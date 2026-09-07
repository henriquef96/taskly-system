# Estratégia de Testes e Qualidade: Taskly

## Backend

Toda nova funcionalidade, endpoint ou regra de negócio deve ter teste PHPUnit.
Priorize:

- fluxos reais da API REST;
- validação de Form Requests;
- Policies e isolamento por `user_id`;
- autorização e binding pai/filho em recursos aninhados;
- migrations e contratos de anexos.

## Frontend

Componentes e fluxos críticos devem ter testes Vitest/Testing Library. O build
deve validar TypeScript antes de gerar o bundle.

## Execução

```bash
docker compose exec app php artisan test
docker compose exec app vendor/bin/pint --test
cd frontend
npm run build
npm run lint
npm run test
```

Testes backend usam SQLite em memória conforme `backend/phpunit.xml`.

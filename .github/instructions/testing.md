# Estratégia de Testes e Qualidade: Taskly

## Diretrizes de Testes (Backend)

- **Testes de Integração/Feature:** Toda nova funcionalidade, endpoint ou regra de negócio deve obrigatoriamente acompanhar seu respectivo teste usando **Pest PHP** ou **PHPUnit**.
- **Cobertura Crítica:**
  - Fluxos reais de endpoints da API REST.
  - Validação de entrada de dados (`Form Requests`).
  - Permissões de acesso e políticas de segurança (`Policies` e isolamento por `user_id`).

---

## Execução do Ambiente

A execução e validação dos testes deve ser feita no container Docker do projeto:

```bash
docker compose exec app php artisan test
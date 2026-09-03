# Instruções de Desenvolvimento

## Stack

### Backend
- PHP 8.4+
- Laravel
- PostgreSQL
- API REST

### Frontend
- React
- TypeScript
- Tailwind CSS
- Vite

### Infraestrutura
- Docker / Docker Compose

---

## Princípios de Desenvolvimento

O código deve seguir:

- SOLID
- Clean Code
- DRY
- KISS
- Separation of Concerns
- Single Responsibility Principle

### Regras

- Manter responsabilidades bem separadas.
- Controllers devem ser simples e não conter regras complexas de negócio.
- Regras de negócio devem ficar em Services quando necessário.
- Utilizar Form Requests para validação das entradas.
- Utilizar Policies/Gates para autorização.
- Evitar duplicação de código.
- Preferir soluções simples em vez de overengineering.
- Criar código legível, testável e de fácil manutenção.
- Não criar abstrações, classes ou dependências sem necessidade real.
- Nunca confiar exclusivamente no frontend para validação ou segurança.
- Nunca expor credenciais, tokens ou informações sensíveis.
- O frontend deve consumir o backend exclusivamente através da API REST.
- Utilizar TypeScript com tipagem forte e evitar `any`.

## GitHub Copilot

Antes de gerar ou alterar código:

1. Explicar cada passo da implementação.
2. Verificar a estrutura existente do projeto.
3. Respeitar os padrões e princípios definidos neste documento.
4. Reutilizar código existente quando possível.
5. Evitar alterações desnecessárias.
6. Priorizar simplicidade, segurança, legibilidade e testabilidade.
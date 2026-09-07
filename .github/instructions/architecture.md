# Diretrizes de Arquitetura e Stack: Taskly

## Tech Stack

### Backend
- **Linguagem / Framework:** PHP 8.4+ | Laravel 13+
- **Banco de Dados:** PostgreSQL
- **Autenticação:** Laravel Sanctum stateful para SPA, com sessão/cookie e CSRF
- **Comunicação:** API REST documentada e testada
- **Respostas:** SEMPRE utilizar Laravel API Resources (`JsonResource`) para padronização de retornos JSON.

### Frontend
- **Linguagem / Framework:** React 19+ | TypeScript (Tipagem estrita) | Vite | Tailwind CSS
- **Estado / Data Fetching:** TanStack Query (React Query) v5 + Axios
- **Organização de Código:**
  - Tipos globais e interfaces da API em `src/types/`.
  - Chamadas de API e rotinas assíncronas em custom hooks em `src/hooks/`.

### Infraestrutura
- Docker / Docker Compose

---

## Regras de Código e Padrões de Design

### Backend (Laravel)
- **Controllers:** Devem ser extremamente diretos (*thin controllers*). Apenas recebem a requisição, chamam a camada de serviço/ação e retornam o `JsonResource`.
- **Validação:** OBRIGATÓRIO utilizar `Form Request` para qualquer criação ou atualização.
- **Regras de Negócio:** Centralizadas em **Services** ou **Single-Action Classes (Actions)**.
- **Autorização:** OBRIGATÓRIO utilizar `Policies` em todas as rotas de recursos para garantir o isolamento de dados por usuário (`user_id`).
- **Segurança:** NUNCA confiar no frontend para validação de segurança ou integridade dos dados.

### Frontend (React + TS)
- **Tipagem:** PROIBIDO o uso do tipo `any`. Defina explicitamente interfaces ou types.
- **Componentes:** Responsabilidade única, modulares e visual limpo com Tailwind CSS.
- **Comunicação:** Exclusivamente via consumo da API REST do backend.
- **Segurança:** NUNCA expor credenciais, chaves privadas ou tokens no código do cliente.
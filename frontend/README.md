# Taskly Frontend

SPA React 19 com TypeScript, Vite, Tailwind CSS, TanStack Query, Axios e
React Router.

## Executar

Localmente:

```bash
npm ci
copy .env.example .env
npm run dev
```

A aplicação fica em <http://localhost:5173>. O proxy de desenvolvimento envia
`/api` e `/sanctum` para o backend configurado em `VITE_PROXY_TARGET`.

Com Docker:

```bash
docker compose up --build frontend
```

## Variáveis

`VITE_API_URL` define a base da API. Em Docker, use `/api` para manter o
frontend no mesmo host do proxy. Variáveis `VITE_*` são públicas e nunca devem
conter secrets.

## Organização

```text
src/api/          cliente HTTP e contratos de chamadas REST
src/auth/         contexto de autenticação
src/components/   componentes reutilizáveis e layout
src/config/       configuração de ambiente e Query Client
src/hooks/        estado assíncrono e preferências da UI
src/pages/        telas de login, dashboard, projetos, tarefas e settings
src/types/        tipos da API e formulários
```

Todas as chamadas de rede passam por `src/api` e hooks TanStack Query. O estado
de autenticação usa sessão Sanctum; `401` em `/api/me` é tratado como visitante,
sem erro de console.

## Funcionalidades principais

- autenticação, cadastro, logout e troca de senha;
- dashboard e CRUD de projetos/tarefas;
- visualização Lista/Kanban com preferência persistida;
- tags por usuário;
- upload, download e exclusão de anexos em projeto e tarefa;
- UI responsiva para login, cadastro e área autenticada.

## Scripts

```bash
npm run dev       # desenvolvimento com HMR
npm run build     # TypeScript + bundle de produção
npm run lint      # Oxlint
npm run test      # Vitest
npm run preview   # pré-visualização do bundle
```

Evite `any`, mantenha componentes focados e atualize os testes ao alterar
contratos de API ou fluxos de autenticação.

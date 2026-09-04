# frontend

Base do frontend do **taskly-system**: React + TypeScript + Tailwind CSS + Vite, consumindo a API REST do backend Laravel.

## Estrutura

```
src/
├── api/          # Cliente HTTP e chamadas à API REST (único ponto de acesso à rede)
├── components/   # Componentes de UI reutilizáveis
├── config/       # Configuração de ambiente (variáveis VITE_*)
├── hooks/        # Hooks customizados (regras de estado/efeitos)
├── pages/        # Páginas da aplicação
└── types/        # Tipos TypeScript compartilhados
```

## Como rodar

### Local

```bash
npm install
cp .env.example .env
npm run dev
```

Acesse `http://localhost:5173`.

### Docker

```bash
docker compose up -d --build frontend
```

## Scripts

- `npm run dev` — servidor de desenvolvimento com HMR.
- `npm run build` — checagem de tipos (`tsc -b`) e build de produção.
- `npm run lint` — lint com Oxlint.
- `npm run preview` — pré-visualiza o build de produção.

## Convenções

Seguindo `.github/copilot-instructions.md`:

- TypeScript com tipagem forte, sem `any`.
- Toda comunicação com o backend passa pelo `httpClient` (`src/api`) — nenhum outro módulo chama `fetch` diretamente.
- A URL da API é configurada via `VITE_API_URL` (ver `.env.example`).
- Componentes simples e focados; regras de estado/efeito ficam em hooks (`src/hooks`).

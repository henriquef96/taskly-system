/**
 * Configurações de ambiente do frontend.
 * Toda variável consumida pela aplicação deve ser lida a partir deste módulo,
 * evitando acesso direto a `import.meta.env` espalhado pelo código.
 */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
} as const

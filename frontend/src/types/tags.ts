/**
 * O backend retorna tags apenas dentro de tarefas.
 *
 * Não existe endpoint de catálogo/CRUD de tags em backend/routes/api.php.
 * Por isso, a interface de seleção recebe as tags já retornadas pela lista
 * de tarefas e não tenta chamar uma rota que ainda não foi implementada.
 */
export interface Tag {
  id: number
  name: string
  color: string
}

export type TagId = Tag['id']

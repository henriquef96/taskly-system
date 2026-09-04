import type { Project, Task, User } from '@/types/api'

export const user: User = { id: 1, name: 'Ana Souza', email: 'ana@example.com' }

export const project: Project = {
  id: 10,
  user_id: user.id,
  name: 'Website',
  description: 'Novo site',
  status: 'active',
  created_at: '2026-09-01T10:00:00Z',
  updated_at: '2026-09-01T10:00:00Z',
}

export const task: Task = {
  id: 20,
  project_id: project.id,
  title: 'Publicar landing page',
  short_description: 'Revisar e publicar a landing page',
  full_description: null,
  due_date: null,
  status: 'pending',
  position: 1,
  tags: [],
  created_at: '2026-09-01T10:00:00Z',
  updated_at: '2026-09-01T10:00:00Z',
}

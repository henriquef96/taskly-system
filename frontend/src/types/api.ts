import type { Tag } from '@/types/tags'

export type { Tag }

export interface User {
  id: number
  name: string
  email: string
}

export type ProjectStatus = 'active' | 'completed' | 'archived'

export interface Project {
  id: number
  user_id: number
  name: string
  description: string | null
  status: ProjectStatus
  created_at: string
  updated_at: string
}

export const TASK_STATUS_VALUES = ['pending', 'in_progress', 'completed', 'cancelled'] as const

export type TaskStatus = (typeof TASK_STATUS_VALUES)[number]

export const taskStatusLabels: Record<TaskStatus, string> = {
  pending: 'Não iniciada',
  in_progress: 'Em andamento',
  completed: 'Concluída',
  cancelled: 'Cancelada',
}

export function getTaskStatusLabel(status: TaskStatus): string {
  return taskStatusLabels[status]
}

export function isTaskStatus(value: string): value is TaskStatus {
  return TASK_STATUS_VALUES.includes(value as TaskStatus)
}

export interface Attachment {
  id: number
  task_id: number
  file_path: string
  file_name: string
  mime_type: string
  file_size: number
}

export interface Task {
  id: number
  project_id: number
  title: string
  short_description: string
  full_description: string | null
  due_date: string | null
  status: TaskStatus
  position: number
  tags: Tag[]
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface UserResponse {
  user: User
}

export interface DataEnvelope<T> {
  data: T
}

export interface Collection<T> {
  data: T[]
}

export interface ProjectRequest {
  name: string
  description?: string | null
  status?: ProjectStatus
}

export interface ProjectInput {
  name: string
  description?: string | null
  status?: ProjectStatus
}

export interface TaskRequest {
  title: string
  short_description: string
  full_description?: string | null
  due_date?: string | null
  status?: TaskStatus
  position?: number
  tags?: number[]
}

export interface TaskInput {
  title: string
  short_description: string
  full_description?: string | null
  due_date?: string | null
  status?: TaskStatus
  position?: number
  tags?: number[]
}

export interface ValidationErrorResponse {
  message?: string
  errors?: Record<string, string[]>
}

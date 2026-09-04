export interface User {
  id: number
  name: string
  email: string
}

export interface Project {
  id: number
  user_id: number
  name: string
  description: string | null
  status: 'active' | 'completed' | 'archived'
  created_at: string
  updated_at: string
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

export interface Tag {
  id: number
  name: string
  color: string
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
  tags?: Tag[]
  attachments?: Attachment[]
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

export interface Collection<T> {
  data: T[]
}

export interface ProjectInput {
  name: string
  description?: string | null
  status?: Project['status']
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

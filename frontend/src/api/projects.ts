import { httpClient } from '@/api/httpClient'
import type { Collection, DataEnvelope, Project, ProjectInput, Task, TaskInput } from '@/types/api'

export async function listProjects(): Promise<Collection<Project>> {
  const { data } = await httpClient.get<Collection<Project>>('/projects')
  return data
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const { data } = await httpClient.post<DataEnvelope<Project>>('/projects', input)
  return data.data
}

export async function getProject(projectId: number): Promise<Project> {
  const { data } = await httpClient.get<DataEnvelope<Project>>(`/projects/${projectId}`)
  return data.data
}

export async function updateProject(projectId: number, input: ProjectInput): Promise<Project> {
  const { data } = await httpClient.patch<DataEnvelope<Project>>(`/projects/${projectId}`, input)
  return data.data
}

export async function deleteProject(projectId: number): Promise<void> {
  await httpClient.delete(`/projects/${projectId}`)
}

export async function listTasks(projectId: number): Promise<Collection<Task>> {
  const { data } = await httpClient.get<Collection<Task>>(`/projects/${projectId}/tasks`)
  return data
}

export async function createTask(projectId: number, input: TaskInput): Promise<Task> {
  const { data } = await httpClient.post<Task>(`/projects/${projectId}/tasks`, input)
  return data
}

export async function updateTask(projectId: number, taskId: number, input: TaskInput): Promise<Task> {
  const { data } = await httpClient.patch<Task>(`/projects/${projectId}/tasks/${taskId}`, input)
  return data
}

export async function deleteTask(projectId: number, taskId: number): Promise<void> {
  await httpClient.delete(`/projects/${projectId}/tasks/${taskId}`)
}

export async function updateTaskStatus(taskId: number, status: Task['status']): Promise<Task> {
  const { data } = await httpClient.patch<Task>(`/tasks/${taskId}/status`, { status })
  return data
}

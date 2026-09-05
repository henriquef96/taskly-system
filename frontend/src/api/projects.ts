import { httpClient } from '@/api/httpClient'
import type { Attachment, Collection, DashboardData, DataEnvelope, Project, ProjectInput, Task, TaskInput } from '@/types/api'
import type { Tag } from '@/types/tags'

export async function getDashboard(): Promise<DashboardData> {
  const { data } = await httpClient.get<DataEnvelope<DashboardData>>('/dashboard')
  return data.data
}

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

export async function uploadProjectAttachment(projectId: number, file: File, onProgress?: (progress: number) => void): Promise<Attachment> {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await httpClient.post<DataEnvelope<Attachment>>(`/projects/${projectId}/attachments`, formData, {
    onUploadProgress: (event) => {
      if (event.total) onProgress?.(Math.round((event.loaded * 100) / event.total))
    },
  })
  return data.data
}

export async function deleteProjectAttachment(attachmentId: number): Promise<void> {
  await httpClient.delete(`/project-attachments/${attachmentId}`)
}

export async function listTags(): Promise<Collection<Tag>> {
  const { data } = await httpClient.get<Collection<Tag>>('/tags')
  return data
}


export async function listTasks(projectId: number): Promise<Collection<Task>> {
  const { data } = await httpClient.get<Collection<Task>>(`/projects/${projectId}/tasks`)
  return data
}

export async function createTask(projectId: number, input: TaskInput): Promise<Task> {
  const { data } = await httpClient.post<DataEnvelope<Task>>(`/projects/${projectId}/tasks`, input)
  return data.data
}

export async function updateTask(projectId: number, taskId: number, input: TaskInput): Promise<Task> {
  const { data } = await httpClient.patch<DataEnvelope<Task>>(`/projects/${projectId}/tasks/${taskId}`, input)
  return data.data
}

export async function deleteTask(projectId: number, taskId: number): Promise<void> {
  await httpClient.delete(`/projects/${projectId}/tasks/${taskId}`)
}

export async function updateTaskStatus(taskId: number, status: Task['status']): Promise<Task> {
  const { data } = await httpClient.patch<DataEnvelope<Task>>(`/tasks/${taskId}/status`, { status })
  return data.data
}

export async function uploadTaskAttachment(
  taskId: number,
  file: File,
  onProgress?: (progress: number) => void,
): Promise<Attachment> {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await httpClient.post<DataEnvelope<Attachment>>(`/tasks/${taskId}/attachments`, formData, {
    onUploadProgress: (event) => {
      if (event.total) onProgress?.(Math.round((event.loaded * 100) / event.total))
    },
  })

  return data.data
}

export async function deleteTaskAttachment(attachmentId: number): Promise<void> {
  await httpClient.delete(`/attachments/${attachmentId}`)
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as projectsApi from '@/api/projects'
import type { ProjectInput, TaskInput, TaskStatus } from '@/types/api'

export function useProjects() {
  return useQuery({ queryKey: ['projects'], queryFn: projectsApi.listProjects })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ProjectInput) => projectsApi.createProject(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  })
}

export function useProject(projectId: number) {
  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => projectsApi.getProject(projectId),
    enabled: Number.isInteger(projectId) && projectId > 0,
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, input }: { projectId: number; input: ProjectInput }) =>
      projectsApi.updateProject(projectId, input),
    onSuccess: (project) => {
      queryClient.setQueryData(['projects', project.id], project)
      void queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (projectId: number) => projectsApi.deleteProject(projectId),
    onSuccess: (_data, projectId) => {
      queryClient.removeQueries({ queryKey: ['projects', projectId] })
      void queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useProjectTasks(projectId: number) {
  return useQuery({
    queryKey: ['projects', projectId, 'tasks'],
    queryFn: () => projectsApi.listTasks(projectId),
    enabled: Number.isInteger(projectId) && projectId > 0,
  })
}

export function useCreateTask(projectId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: TaskInput) => projectsApi.createTask(projectId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] }),
  })
}

export function useUpdateTask(projectId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, input }: { taskId: number; input: TaskInput }) =>
      projectsApi.updateTask(projectId, taskId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] }),
  })
}

export function useDeleteTask(projectId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (taskId: number) => projectsApi.deleteTask(projectId, taskId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] }),
  })
}

export function useUpdateTaskStatus(projectId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: number; status: TaskStatus }) => projectsApi.updateTaskStatus(taskId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] }),
  })
}

export function useUploadTaskAttachment(projectId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, file, onProgress }: {
      taskId: number
      file: File
      onProgress?: (progress: number) => void
    }) => projectsApi.uploadTaskAttachment(taskId, file, onProgress),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] }),
  })
}

export function useDeleteTaskAttachment(projectId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (attachmentId: number) => projectsApi.deleteTaskAttachment(attachmentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] }),
  })
}

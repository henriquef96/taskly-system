import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as projectsApi from '@/api/projects'
import type { ProjectInput, TaskInput, TaskStatus } from '@/types/api'

export function useProjects() {
  return useQuery({ queryKey: ['projects'], queryFn: projectsApi.listProjects })
}

export function useTags() {
  return useQuery({ queryKey: ['tags'], queryFn: projectsApi.listTags })
}


export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ProjectInput) => projectsApi.createProject(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
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
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
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
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useUploadProjectAttachment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, file, onProgress }: { projectId: number; file: File; onProgress?: (progress: number) => void }) => projectsApi.uploadProjectAttachment(projectId, file, onProgress),
    onSuccess: (_attachment, { projectId }) => {
      void queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
      void queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useDeleteProjectAttachment(projectId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (attachmentId: number) => projectsApi.deleteProjectAttachment(attachmentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
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

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: projectsApi.getDashboard,
  })
}

export function useCreateTask(projectId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: TaskInput) => projectsApi.createTask(projectId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useUpdateTask(projectId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, input }: { taskId: number; input: TaskInput }) =>
      projectsApi.updateTask(projectId, taskId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

type DeleteTaskVariables = number | { projectId: number; taskId: number }

export function useDeleteTask(projectId?: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (variables: DeleteTaskVariables) => {
      const target = typeof variables === 'number'
        ? { projectId, taskId: variables }
        : variables

      if (!target.projectId) {
        throw new Error('O projeto da tarefa é obrigatório para excluí-la.')
      }

      return projectsApi.deleteTask(target.projectId, target.taskId)
    },
    onSuccess: (_data, variables) => {
      const targetProjectId = typeof variables === 'number' ? projectId : variables.projectId

      if (targetProjectId) {
        void queryClient.invalidateQueries({ queryKey: ['projects', targetProjectId, 'tasks'] })
      }
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useUpdateTaskStatus(projectId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: number; status: TaskStatus }) => projectsApi.updateTaskStatus(taskId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
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
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useDeleteTaskAttachment(projectId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (attachmentId: number) => projectsApi.deleteTaskAttachment(attachmentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

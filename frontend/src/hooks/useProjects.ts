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
  return useQuery({ queryKey: ['projects', projectId], queryFn: () => projectsApi.getProject(projectId) })
}

export function useProjectTasks(projectId: number) {
  return useQuery({ queryKey: ['projects', projectId, 'tasks'], queryFn: () => projectsApi.listTasks(projectId) })
}

export function useCreateTask(projectId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: TaskInput) => projectsApi.createTask(projectId, input),
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

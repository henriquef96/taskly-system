import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as projectsApi from '@/api/projects'
import { useToast } from '@/components/toast/ToastProvider'
import type { ProjectInput, TaskInput, TaskStatus } from '@/types/api'

export function useProjects() {
  return useQuery({ queryKey: ['projects'], queryFn: projectsApi.listProjects })
}

export function useTags() {
  return useQuery({ queryKey: ['tags'], queryFn: projectsApi.listTags })
}


export function useCreateProject() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (input: ProjectInput) => projectsApi.createProject(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      showToast({
        title: 'Projeto criado',
        description: 'O novo projeto foi adicionado ao painel.',
        variant: 'success',
      })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Não foi possível criar o projeto.'
      showToast({
        title: 'Falha ao criar projeto',
        description: message,
        variant: 'error',
      })
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
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ projectId, input }: { projectId: number; input: ProjectInput }) =>
      projectsApi.updateProject(projectId, input),
    onSuccess: (project) => {
      queryClient.setQueryData(['projects', project.id], project)
      void queryClient.invalidateQueries({ queryKey: ['projects'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      showToast({
        title: 'Projeto atualizado',
        description: 'As informações do projeto foram salvas.',
        variant: 'success',
      })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Não foi possível salvar as alterações.'
      showToast({
        title: 'Falha ao atualizar projeto',
        description: message,
        variant: 'error',
      })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (projectId: number) => projectsApi.deleteProject(projectId),
    onSuccess: (_data, projectId) => {
      queryClient.removeQueries({ queryKey: ['projects', projectId] })
      void queryClient.invalidateQueries({ queryKey: ['projects'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      showToast({
        title: 'Projeto excluído',
        description: 'O projeto foi removido com sucesso.',
        variant: 'info',
      })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Não foi possível excluir o projeto.'
      showToast({
        title: 'Exclusão falhou',
        description: message,
        variant: 'error',
      })
    },
  })
}

export function useUploadProjectAttachment() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ projectId, file, onProgress }: { projectId: number; file: File; onProgress?: (progress: number) => void }) => projectsApi.uploadProjectAttachment(projectId, file, onProgress),
    onSuccess: (_attachment, { projectId }) => {
      void queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
      void queryClient.invalidateQueries({ queryKey: ['projects'] })
      showToast({
        title: 'Anexo adicionado',
        description: 'O arquivo foi enviado ao projeto.',
        variant: 'success',
      })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Não foi possível enviar o arquivo.'
      showToast({
        title: 'Envio falhou',
        description: message,
        variant: 'error',
      })
    },
  })
}

export function useDeleteProjectAttachment(projectId: number) {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (attachmentId: number) => projectsApi.deleteProjectAttachment(attachmentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
      void queryClient.invalidateQueries({ queryKey: ['projects'] })
      showToast({
        title: 'Anexo removido',
        description: 'O arquivo foi removido do projeto.',
        variant: 'info',
      })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Não foi possível remover o anexo.'
      showToast({
        title: 'Remoção falhou',
        description: message,
        variant: 'error',
      })
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
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (input: TaskInput) => projectsApi.createTask(projectId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      showToast({
        title: 'Tarefa criada',
        description: 'A nova tarefa foi adicionada ao projeto.',
        variant: 'success',
      })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Não foi possível criar a tarefa.'
      showToast({
        title: 'Falha ao criar tarefa',
        description: message,
        variant: 'error',
      })
    },
  })
}

export function useUpdateTask(projectId: number) {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ taskId, input }: { taskId: number; input: TaskInput }) =>
      projectsApi.updateTask(projectId, taskId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      showToast({
        title: 'Tarefa atualizada',
        description: 'A tarefa foi salva com sucesso.',
        variant: 'success',
      })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Não foi possível salvar a tarefa.'
      showToast({
        title: 'Falha ao atualizar tarefa',
        description: message,
        variant: 'error',
      })
    },
  })
}

type DeleteTaskVariables = number | { projectId: number; taskId: number }

export function useDeleteTask(projectId?: number) {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

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
      showToast({
        title: 'Tarefa excluída',
        description: 'A tarefa foi removida do projeto.',
        variant: 'info',
      })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Não foi possível excluir a tarefa.'
      showToast({
        title: 'Exclusão falhou',
        description: message,
        variant: 'error',
      })
    },
  })
}

export function useUpdateTaskStatus(projectId: number) {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: number; status: TaskStatus }) => projectsApi.updateTaskStatus(taskId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      showToast({
        title: 'Status atualizado',
        description: 'A mudança de status foi salva.',
        variant: 'success',
      })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Não foi possível atualizar o status.'
      showToast({
        title: 'Atualização falhou',
        description: message,
        variant: 'error',
      })
    },
  })
}

export function useUploadTaskAttachment(projectId: number) {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ taskId, file, onProgress }: {
      taskId: number
      file: File
      onProgress?: (progress: number) => void
    }) => projectsApi.uploadTaskAttachment(taskId, file, onProgress),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      showToast({
        title: 'Anexo enviado',
        description: 'O arquivo foi adicionado à tarefa.',
        variant: 'success',
      })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Não foi possível anexar o arquivo.'
      showToast({
        title: 'Envio falhou',
        description: message,
        variant: 'error',
      })
    },
  })
}

export function useDeleteTaskAttachment(projectId: number) {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (attachmentId: number) => projectsApi.deleteTaskAttachment(attachmentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      showToast({
        title: 'Anexo removido',
        description: 'O arquivo foi removido da tarefa.',
        variant: 'info',
      })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Não foi possível remover o anexo.'
      showToast({
        title: 'Remoção falhou',
        description: message,
        variant: 'error',
      })
    },
  })
}

import api from '@/lib/api'
import type { Project } from '@/types'

export interface ProjectPayload {
  name: string
  clientId: string
  description?: string
}

export const projectService = {
  getAll: (clientId?: string) =>
    api.get<Project[]>('/projects', { params: clientId ? { clientId } : {} }).then((r) => r.data),
  getOne: (id: string) => api.get<Project>(`/projects/${id}`).then((r) => r.data),
  create: (data: ProjectPayload) => api.post<Project>('/projects', data).then((r) => r.data),
  update: (id: string, data: Partial<ProjectPayload>) =>
    api.put<Project>(`/projects/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/projects/${id}`),
}

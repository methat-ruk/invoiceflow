import api from '@/lib/api'
import type { Client } from '@/types'

export interface ClientPayload {
  name: string
  email: string
  phone?: string
  address?: string
}

export const clientService = {
  getAll: () => api.get<Client[]>('/clients').then((r) => r.data),
  getOne: (id: string) => api.get<Client>(`/clients/${id}`).then((r) => r.data),
  create: (data: ClientPayload) => api.post<Client>('/clients', data).then((r) => r.data),
  update: (id: string, data: ClientPayload) =>
    api.put<Client>(`/clients/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/clients/${id}`),
}

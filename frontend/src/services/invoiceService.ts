import api from '@/lib/api'
import type { Invoice, InvoiceStatus } from '@/types'

export interface InvoiceItemPayload {
  description: string
  quantity: number
  unitPrice: number
}

export interface InvoicePayload {
  clientId: string
  projectId?: string
  dueDate: string
  vatRate?: number
  discount?: number
  notes?: string
  items: InvoiceItemPayload[]
}

export const invoiceService = {
  getAll: () => api.get<Invoice[]>('/invoices').then((r) => r.data),
  getOne: (id: string) => api.get<Invoice>(`/invoices/${id}`).then((r) => r.data),
  create: (data: InvoicePayload) => api.post<Invoice>('/invoices', data).then((r) => r.data),
  update: (id: string, data: Partial<InvoicePayload> & { status?: InvoiceStatus }) =>
    api.put<Invoice>(`/invoices/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/invoices/${id}`),
}

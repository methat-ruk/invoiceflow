export interface User {
  id: string
  email: string
  name: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface ApiError {
  message: string
  error?: string
  statusCode?: number
}

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE'

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
  invoiceId: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  status: InvoiceStatus
  issueDate: string
  dueDate: string
  subtotal: number
  vatRate: number
  vatAmount: number
  discount: number
  total: number
  notes?: string | null
  clientId: string
  projectId?: string | null
  userId: string
  createdAt: string
  updatedAt: string
  client: { id: string; name: string }
  project?: { id: string; name: string } | null
  items: InvoiceItem[]
}

export interface Project {
  id: string
  name: string
  description?: string | null
  clientId: string
  userId: string
  createdAt: string
  updatedAt: string
  client: { id: string; name: string }
}

export interface Client {
  id: string
  name: string
  email: string
  phone?: string | null
  address?: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

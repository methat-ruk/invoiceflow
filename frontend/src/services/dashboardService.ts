import api from '@/lib/api'

export interface DashboardStats {
  clients: number
  projects: number
  invoices: {
    total: number
    draft: number
    sent: number
    paid: number
    overdue: number
  }
  revenue: {
    paid: number
    outstanding: number
  }
}

export const dashboardService = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats').then((r) => r.data),
}

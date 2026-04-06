'use client'

import { useEffect, useState } from 'react'
import {
  Users,
  FolderKanban,
  FileText,
  CircleDollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  FilePen,
} from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import { dashboardService, type DashboardStats } from '@/services/dashboardService'

function fmt(n: number) {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  sub,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  iconColor: string
  iconBg: string
  sub?: string
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{sub}</p>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  )
}

function StatusRow({
  label,
  count,
  icon: Icon,
  color,
  bar,
  total,
}: {
  label: string
  count: number
  icon: React.ElementType
  color: string
  bar: string
  total: number
}) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${color}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-300">{label}</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{count}</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  )
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    dashboardService
      .getStats()
      .then(setStats)
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Topbar title="Dashboard" />
      <main className="flex-1 p-4 md:p-6">
        {error && (
          <p className="mb-4 rounded-md border border-red-200 bg-red-100 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-300">
            {error}
          </p>
        )}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
              />
            ))}
          </div>
        ) : stats ? (
          <div className="space-y-6">
            {/* stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total Clients"
                value={stats.clients}
                icon={Users}
                iconColor="text-violet-600 dark:text-violet-300"
                iconBg="bg-violet-100 dark:bg-violet-900/40"
              />
              <StatCard
                label="Total Projects"
                value={stats.projects}
                icon={FolderKanban}
                iconColor="text-blue-600 dark:text-blue-300"
                iconBg="bg-blue-100 dark:bg-blue-900/40"
              />
              <StatCard
                label="Total Invoices"
                value={stats.invoices.total}
                icon={FileText}
                iconColor="text-amber-600 dark:text-amber-300"
                iconBg="bg-amber-100 dark:bg-amber-900/40"
              />
              <StatCard
                label="Revenue Collected"
                value={`฿${fmt(stats.revenue.paid)}`}
                icon={CircleDollarSign}
                iconColor="text-emerald-600 dark:text-emerald-300"
                iconBg="bg-emerald-100 dark:bg-emerald-900/40"
                sub={`฿${fmt(stats.revenue.outstanding)} outstanding`}
              />
            </div>

            {/* invoice status breakdown */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Invoice Status Breakdown
              </h2>
              <div className="space-y-3">
                <StatusRow
                  label="Draft"
                  count={stats.invoices.draft}
                  total={stats.invoices.total}
                  icon={FilePen}
                  color="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  bar="bg-gray-400"
                />
                <StatusRow
                  label="Sent"
                  count={stats.invoices.sent}
                  total={stats.invoices.total}
                  icon={Clock}
                  color="bg-blue-100 text-blue-500 dark:bg-blue-900/40 dark:text-blue-400"
                  bar="bg-blue-500"
                />
                <StatusRow
                  label="Paid"
                  count={stats.invoices.paid}
                  total={stats.invoices.total}
                  icon={CheckCircle2}
                  color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
                  bar="bg-emerald-500"
                />
                <StatusRow
                  label="Overdue"
                  count={stats.invoices.overdue}
                  total={stats.invoices.total}
                  icon={AlertCircle}
                  color="bg-red-100 text-red-500 dark:bg-red-900/40 dark:text-red-400"
                  bar="bg-red-500"
                />
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </>
  )
}

export default DashboardPage

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FolderOpen, FileText, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLayoutStore } from '@/store/layoutStore'

const navSections = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Management',
    items: [
      { href: '/clients', label: 'Clients', icon: Users },
      { href: '/projects', label: 'Projects', icon: FolderOpen },
      { href: '/invoices', label: 'Invoices', icon: FileText },
    ],
  },
]

const Sidebar = () => {
  const pathname = usePathname()
  const { sidebarOpen, closeSidebar } = useLayoutStore()

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex h-full flex-col bg-violet-100 dark:bg-gray-900',
        'border-r border-violet-100 dark:border-gray-800',
        'transition-all duration-300 ease-in-out',
        sidebarOpen
          ? 'w-64 translate-x-0 lg:static lg:translate-x-0'
          : '-translate-x-full lg:static lg:w-0 lg:translate-x-0 lg:overflow-hidden lg:border-r-0'
      )}
    >
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-violet-100 px-5 dark:border-gray-800">
        <span className="bg-linear-to-r from-violet-600 to-sky-500 bg-clip-text text-base font-bold tracking-tight text-transparent">
          InvoiceFlow
        </span>
        <button
          onClick={closeSidebar}
          className="cursor-pointer rounded-md p-1 text-violet-400 hover:bg-violet-100 hover:text-violet-700 dark:hover:bg-gray-800 dark:hover:text-gray-300 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto p-3">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-violet-400 dark:text-gray-500">
              {section.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {section.items.map(({ href, label, icon: Icon }) => {
                const isActive = pathname.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => { if (window.innerWidth < 1024) closeSidebar() }}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-violet-600 text-white dark:bg-violet-500'
                        : 'text-violet-700 hover:bg-violet-200 hover:text-violet-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar

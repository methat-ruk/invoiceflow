'use client'

import { Menu } from 'lucide-react'
import { useLayoutStore } from '@/store/layoutStore'
import ThemeToggle from './ThemeToggle'
import AppBreadcrumb from './AppBreadcrumb'

interface TopbarProps {
  title: string
}

const Topbar = ({ title }: TopbarProps) => {
  const { toggleSidebar } = useLayoutStore()

  return (
    <header className="shrink-0 border-b border-violet-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Row 1: hamburger + title + actions */}
      <div className="flex h-14 items-center gap-3 px-4 md:px-6">
        <button
          onClick={toggleSidebar}
          className="cursor-pointer rounded-md p-1.5 text-violet-500 hover:bg-violet-50 hover:text-violet-700 dark:text-violet-400 dark:hover:bg-violet-950 dark:hover:text-violet-200"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="flex-1 text-base font-semibold text-gray-900 dark:text-gray-100 md:text-lg">
          {title}
        </h1>

        <ThemeToggle />
      </div>

      {/* Row 2: breadcrumb */}
      <div className="border-t border-violet-100 px-4 py-2 dark:border-gray-800 md:px-6">
        <AppBreadcrumb />
      </div>
    </header>
  )
}

export default Topbar

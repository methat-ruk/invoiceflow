'use client'

import { Menu, LogOut, ChevronDown, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLayoutStore } from '@/store/layoutStore'
import { useAuthStore } from '@/store/authStore'
import ThemeToggle from './ThemeToggle'
import AppBreadcrumb from './AppBreadcrumb'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

interface TopbarProps {
  title: string
}

const Topbar = ({ title }: TopbarProps) => {
  const { toggleSidebar } = useLayoutStore()
  const { logout, user } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

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

        {/* Divider */}
        <div className="hidden h-5 w-px bg-gray-200 dark:bg-gray-700 sm:block" />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900">
                <User className="h-4 w-4 text-violet-600 dark:text-violet-300" />
              </div>
              <div className="hidden flex-col items-start sm:flex">
                <span className="text-sm font-medium leading-tight text-gray-700 dark:text-gray-200">
                  {user?.name ?? 'User'}
                </span>
                <span className="text-xs leading-tight text-gray-400 dark:text-gray-500">
                  {user?.email ?? ''}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Row 2: breadcrumb */}
      <div className="border-t border-violet-100 px-4 py-2 dark:border-gray-800 md:px-6">
        <AppBreadcrumb />
      </div>
    </header>
  )
}

export default Topbar

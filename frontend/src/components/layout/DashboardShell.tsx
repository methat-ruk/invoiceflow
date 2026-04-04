'use client'

import { useEffect } from 'react'
import { useLayoutStore } from '@/store/layoutStore'
import Sidebar from './Sidebar'

const DESKTOP_BREAKPOINT = 1024

const DashboardShell = ({ children }: { children: React.ReactNode }) => {
  const { sidebarOpen, setSidebarOpen, closeSidebar } = useLayoutStore()

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= DESKTOP_BREAKPOINT)
    }

    // Set initial state based on actual screen size
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setSidebarOpen])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}

export default DashboardShell

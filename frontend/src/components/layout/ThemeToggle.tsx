'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/providers/ThemeProvider'

const ThemeToggle = () => {
  const { toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="cursor-pointer gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
    >
      {/* Light mode: show Moon. Dark mode: show Sun */}
      <Moon className="h-4 w-4 dark:hidden" />
      <Sun className="h-4 w-4 hidden dark:block" />
      <span className="hidden sm:inline dark:hidden">Dark</span>
      <span className="hidden sm:dark:inline">Light</span>
    </Button>
  )
}

export default ThemeToggle

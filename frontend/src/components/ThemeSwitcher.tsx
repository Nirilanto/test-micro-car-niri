'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { Moon, Sun, Monitor } from 'lucide-react'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Montage du composant
  useEffect(() => {
    setMounted(true)
  }, [])

  // Ne rien rendre jusqu'au montage côté client
  if (!mounted) return null

  // Rendre les boutons de changement de thème
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setTheme('light')}
        className="p-2 rounded-md bg-gray-200 dark:bg-gray-700"
        aria-label="Mode clair"
      >
        <Sun size={18} />
      </button>
      
      <button
        onClick={() => setTheme('dark')}
        className="p-2 rounded-md bg-gray-200 dark:bg-gray-700"
        aria-label="Mode sombre"
      >
        <Moon size={18} />
      </button>
      
      <button
        onClick={() => setTheme('system')}
        className="p-2 rounded-md bg-gray-200 dark:bg-gray-700"
        aria-label="Mode système"
      >
        <Monitor size={18} />
      </button>
    </div>
  )
}
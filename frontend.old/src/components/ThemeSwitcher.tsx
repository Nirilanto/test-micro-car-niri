// src/components/ThemeSwitcher.tsx
'use client'

import { useTheme } from '@/context/ThemeContext'
import { useState, useEffect } from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Lorsque l'on utilise un état lié au thème, cette méthode est importante
  // pour éviter des problèmes d'hydratation
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-full ${
          theme === 'light' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
        aria-label="Mode clair"
      >
        <Sun size={18} />
      </button>
      
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-full ${
          theme === 'dark' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
        aria-label="Mode sombre"
      >
        <Moon size={18} />
      </button>
      
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-full ${
          theme === 'system' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
        aria-label="Mode système"
      >
        <Monitor size={18} />
      </button>
    </div>
  )
}
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

  // Fonction pour déterminer si un bouton est actif
  const isActive = (mode: string) => theme === mode
  
  // Rendre les boutons de changement de thème
  return (
    <div className="relative bg-muted/80 backdrop-blur-sm rounded-full p-1 flex items-center border border-border/40 shadow-sm">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-full transition-all duration-300 ease-out ${
          isActive('light') 
            ? 'bg-card text-primary shadow-sm transform scale-105' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
        aria-label="Mode clair"
      >
        <Sun size={16} className={`${isActive('light') ? 'animate-in zoom-in-95 duration-300' : ''}`} />
      </button>
      
      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-full transition-all duration-300 ease-out ${
          isActive('dark') 
            ? 'bg-card text-primary shadow-sm transform scale-105' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
        aria-label="Mode sombre"
      >
        <Moon size={16} className={`${isActive('dark') ? 'animate-in zoom-in-95 duration-300' : ''}`} />
      </button>
      
      <button
        onClick={() => setTheme('system')}
        className={`p-1.5 rounded-full transition-all duration-300 ease-out ${
          isActive('system') 
            ? 'bg-card text-primary shadow-sm transform scale-105' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
        aria-label="Mode système"
      >
        <Monitor size={16} className={`${isActive('system') ? 'animate-in zoom-in-95 duration-300' : ''}`} />
      </button>
    </div>
  )
}
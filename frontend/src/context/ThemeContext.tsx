'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

// Valeur par défaut du contexte
const defaultValue: ThemeContextType = {
  theme: 'system',
  setTheme: () => {},
}

// Création du contexte avec une valeur par défaut
const ThemeContext = createContext<ThemeContextType>(defaultValue)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  // Fonction pour définir le thème
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    // Stocker dans localStorage seulement côté client
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme)
    }
  }

  // Initialiser le thème depuis localStorage au montage
  useEffect(() => {
    setMounted(true)
    const storedTheme = localStorage.getItem('theme') as Theme | null
    if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
      setThemeState(storedTheme)
    }
  }, [])

  // Appliquer le thème au document
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme, mounted])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
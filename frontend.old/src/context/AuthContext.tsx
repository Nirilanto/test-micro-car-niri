// src/context/AuthContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/api'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

// Types
interface User {
  id: string
  email: string
  iat: number
  exp: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

// Création du contexte
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Vérifier si un token existe dans localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const decoded = jwtDecode<User>(token)
          // Vérifier si le token est expiré
          if (decoded.exp * 1000 > Date.now()) {
            setUser(decoded)
            // Configurer axios pour envoyer le token dans les headers
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          } else {
            localStorage.removeItem('token')
          }
        } catch (error) {
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }
  }, [])


  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await authService.login(email, password)
      localStorage.setItem('token', data.access_token)
      setUser(data.user)
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }
  
  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      await authService.register(email, password)
      return true
    } catch (error) {
      console.error('Registration error:', error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    router.push('/auth/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personnalisé pour utiliser le contexte d'authentification
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

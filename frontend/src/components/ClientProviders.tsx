'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/context/AuthContext'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider } from '@/context/ThemeContext'

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <ToastContainer position="bottom-right" theme="colored" />
      </AuthProvider>
    </ThemeProvider>
  )
}
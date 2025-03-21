'use client'

import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
  icon: ReactNode
}

export default function AuthLayout({ children, title, subtitle, icon }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-grid-pattern bg-gradient-to-br from-background via-primary/5 to-background/80 p-4 animate-gradient">
      <div className="w-full max-w-md">
        {/* Logo/Branding Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 mb-4 shadow-lg shadow-blue-500/20">
            {icon}
          </div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground mt-2">{subtitle}</p>
        </div>
        
        {/* Card Container */}
        <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden backdrop-blur-sm">
          {children}
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="inline-block w-2 h-2 rounded-full bg-purple-500"></span>
            © {new Date().getFullYear()} Votre Entreprise. Tous droits réservés.
            <span className="inline-block w-2 h-2 rounded-full bg-purple-500"></span>
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
          </p>
        </div>
      </div>
    </div>
  )
}
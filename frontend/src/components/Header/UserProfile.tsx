'use client'

import { LogOut } from 'lucide-react'

interface UserProfileProps {
  email: string
  onLogout: () => void
  compact?: boolean
}

export default function UserProfile({ email, onLogout, compact = false }: UserProfileProps) {
  // Fonction pour obtenir les initiales de l'email
  const getInitials = (email: string) => {
    if (!email) return 'U'
    const parts = email.split('@')
    return parts[0].charAt(0).toUpperCase()
  }
  
  if (compact) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
            {getInitials(email)}
          </div>
          <span className="text-sm font-medium truncate max-w-[150px]">{email}</span>
        </div>
        
        <button
          onClick={onLogout}
          className="text-red-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center"
          aria-label="Déconnexion"
        >
          <LogOut size={18} />
        </button>
      </div>
    )
  }
  
  return (
    <div className="flex items-center space-x-1">
      <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-medium shadow-sm">
        {getInitials(email)}
      </div>
      
      <button
        onClick={onLogout}
        className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted/50"
        title="Déconnexion"
        aria-label="Déconnexion"
      >
        <LogOut size={18} />
      </button>
    </div>
  )
}
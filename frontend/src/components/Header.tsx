'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { usePathname } from 'next/navigation'
import ThemeSwitcher from './ThemeSwitcher'
import { useState } from 'react'
import { User, LogOut } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
  }

  // Fonction pour obtenir les initiales de l'email
  const getInitials = (email: string) => {
    if (!email) return 'U'
    const parts = email.split('@')
    return parts[0].charAt(0).toUpperCase()
  }

  return (
    <header className="bg-card text-card-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Car Rental
        </Link>
        
        <div className="flex items-center space-x-6">
          <nav>
            <ul className="flex space-x-4">
              {!user ? (
                <>
                  <li>
                    <Link 
                      href="/auth/login" 
                      className={`hover:text-primary transition-colors ${
                        pathname === '/auth/login' ? 'text-primary font-semibold' : ''
                      }`}
                    >
                      Connexion
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/auth/register" 
                      className={`hover:text-primary transition-colors ${
                        pathname === '/auth/register' ? 'text-primary font-semibold' : ''
                      }`}
                    >
                      Inscription
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      href="/dashboard" 
                      className={`hover:text-primary transition-colors ${
                        pathname === '/dashboard' ? 'text-primary font-semibold' : ''
                      }`}
                    >
                      Tableau de bord
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/upload" 
                      className={`hover:text-primary transition-colors ${
                        pathname === '/upload' ? 'text-primary font-semibold' : ''
                      }`}
                    >
                      Déposer un document
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
          
          <div className="flex items-center space-x-3">
            <ThemeSwitcher />
            
            {user && (
              <div className="relative">
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 focus:outline-none"
                  aria-label="Menu utilisateur"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                    {getInitials(user.email)}
                  </div>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 z-10 border border-border">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        logout()
                        setShowUserMenu(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
// src/components/Header.tsx
'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { usePathname } from 'next/navigation'
import ThemeSwitcher from './ThemeSwitcher'

export default function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

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
                  <li>
                    <button 
                      onClick={logout} 
                      className="hover:text-primary transition-colors"
                    >
                      Déconnexion
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
          
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}
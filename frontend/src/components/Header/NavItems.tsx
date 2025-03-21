'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItemsProps {
  isAuthenticated: boolean
  onItemClick?: () => void
}

export default function NavItems({ isAuthenticated, onItemClick = () => {} }: NavItemsProps) {
  const pathname = usePathname()
  
  // Helper pour déterminer si un lien est actif
  const isActive = (path: string) => pathname === path
  
  // Classes pour les liens de navigation
  const getLinkClasses = (path: string) => `
    relative hover:text-primary transition-colors duration-300 font-medium
    ${isActive(path) 
      ? 'text-primary font-semibold after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full' 
      : ''}
  `
  
  return (
    <ul className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
      {!isAuthenticated ? (
        <>
          <li>
            <Link 
              href="/auth/login" 
              className={getLinkClasses('/auth/login')}
              onClick={onItemClick}
            >
              Connexion
            </Link>
          </li>
          <li>
            <Link 
              href="/auth/register" 
              className={getLinkClasses('/auth/register')}
              onClick={onItemClick}
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
              className={getLinkClasses('/dashboard')}
              onClick={onItemClick}
            >
              Tableau de bord
            </Link>
          </li>
          <li>
            <Link 
              href="/upload" 
              className={getLinkClasses('/upload')}
              onClick={onItemClick}
            >
              Déposer un document
            </Link>
          </li>
        </>
      )}
    </ul>
  )
}
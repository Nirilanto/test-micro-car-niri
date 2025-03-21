'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Menu, X } from 'lucide-react'
import Logo from '../ui/Logo'
import MobileMenu from './MobileMenu'
import NavItems from './NavItems'
import ThemeSwitcher from './ThemeSwitcher'
import UserProfile from './UserProfile'

export default function Header() {
  const { user, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Fonction pour gérer le scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'bg-card/80 backdrop-blur-md shadow-md' 
        : 'bg-card'
    }`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Logo size="medium" />
        
        {/* Menu Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Navigation et actions desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="mr-4">
            <NavItems isAuthenticated={!!user} />
          </nav>
          
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            
            {user && (
              <UserProfile 
                email={user.email} 
                onLogout={logout} 
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Menu mobile */}
      <MobileMenu 
        isOpen={mobileMenuOpen}
        isAuthenticated={!!user}
        userEmail={user?.email}
        onLogout={logout}
        onClose={closeMobileMenu}
      />
    </header>
  )
}
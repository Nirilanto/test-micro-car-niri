'use client'

import NavItems from './NavItems'
import ThemeSwitcher from './ThemeSwitcher'
import UserProfile from './UserProfile'

interface MobileMenuProps {
  isOpen: boolean
  isAuthenticated: boolean
  userEmail?: string
  onLogout: () => void
  onClose: () => void
}

export default function MobileMenu({ 
  isOpen, 
  isAuthenticated, 
  userEmail = '', 
  onLogout,
  onClose
}: MobileMenuProps) {
  if (!isOpen) return null
  
  const handleLogout = () => {
    onLogout()
    onClose()
  }
  
  return (
    <div className="md:hidden bg-card border-t border-border animate-in slide-in-from-top duration-300">
      <div className="container mx-auto px-4 py-6">
        <nav className="mb-6">
          <NavItems 
            isAuthenticated={isAuthenticated} 
            onItemClick={onClose} 
          />
        </nav>
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <ThemeSwitcher />
          
          {isAuthenticated && userEmail && (
            <UserProfile 
              email={userEmail} 
              onLogout={handleLogout} 
              compact={true} 
            />
          )}
        </div>
      </div>
    </div>
  )
}
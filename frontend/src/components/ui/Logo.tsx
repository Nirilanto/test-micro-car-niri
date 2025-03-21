import Link from 'next/link'
import { Car } from 'lucide-react'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
}

export default function Logo({ size = 'medium' }: LogoProps) {
  const iconSizes = {
    small: 24,
    medium: 35,
    large: 48
  }
  
  const textSizes = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  }
  
  return (
    <Link href="/" className="flex items-center space-x-4 transition-transform hover:scale-105 duration-300">
      <Car className="text-primary" size={iconSizes[size]} />
      <span className={`${textSizes[size]} font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text`}>
        Car Rental
      </span>
    </Link>
  )
}
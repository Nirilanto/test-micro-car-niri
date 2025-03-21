'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import AdvantagesSection from '@/components/HeroSection/AdvantagesSection'
import CTASection from '@/components/HeroSection/CTASection'
import HeroSection from '@/components/HeroSection/HeroSection'
import HowItWorksSection from '@/components/HeroSection/HowItWorksSection'

export default function Home() {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-[60vh]"></div>
  }

  const isAuthenticated = !!user

  return (
    <div>
      <HeroSection isAuthenticated={isAuthenticated} />
      <HowItWorksSection />
      <AdvantagesSection />
      <CTASection isAuthenticated={isAuthenticated} />
    </div>
  )
}
'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface CTASectionProps {
  isAuthenticated: boolean
}

export default function CTASection({ isAuthenticated }: CTASectionProps) {
  return (
    <div className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/5 to-blue-600/10"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
      
      <motion.div 
        className="max-w-6xl mx-auto px-4 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Prêt à commencer?
          </h2>
          <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            Rejoignez notre plateforme et profitez d'une expérience de location simplifiée.
          </p>
          
          {!isAuthenticated ? (
            <Link href="/auth/register">
              <Button 
                variant="primary" 
                size="lg"
                className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
              >
                <span>S'inscrire maintenant</span>
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard">
              <Button 
                variant="primary" 
                size="lg"
                className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
              >
                <span>Accéder à mon espace</span>
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
              </Button>
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  )
}
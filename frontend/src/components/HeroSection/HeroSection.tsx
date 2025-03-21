'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { ArrowRight, Car } from 'lucide-react'

interface HeroSectionProps {
  isAuthenticated: boolean
}

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="bg-gradient-to-br from-card via-card to-muted/30 relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div 
            className="md:w-1/2 text-center md:text-left"
            variants={itemVariants}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              Location de Voitures Simplifiée
            </h1>
            <p className="text-xl mb-8 text-muted-foreground">
              Une plateforme moderne pour la location de véhicules. Téléversez votre permis et commencez à louer en quelques minutes.
            </p>
            
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/auth/register">
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="group w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
                  >
                    <span>Commencer maintenant</span>
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-full sm:w-auto hover:bg-muted/50 transition-colors duration-300 border-2 border-purple-500/30 hover:border-purple-500/50"
                  >
                    Se connecter
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/dashboard">
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="group w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
                  >
                    <span>Tableau de bord</span>
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                  </Button>
                </Link>
                <Link href="/upload">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-full sm:w-auto hover:bg-muted/50 transition-colors duration-300 border-2 border-purple-500/30 hover:border-purple-500/50"
                  >
                    Téléverser un document
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 relative"
            variants={itemVariants}
          >
            <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 border border-border/50 shadow-xl flex items-center justify-center">
              <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
              <Car className="text-blue-600 w-40 h-40 md:w-52 md:h-52 opacity-90" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
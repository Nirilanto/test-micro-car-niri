'use client'

import { motion } from 'framer-motion'
import { Check, Key, FileCheck, Car } from 'lucide-react'

export default function HowItWorksSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

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

  const steps = [
    {
      step: 1,
      title: "Inscription",
      description: "Créez votre compte en quelques clics",
      icon: <Check size={32} className="text-white" />,
      color: "bg-blue-500",
      textColor: "text-blue-500"
    },
    {
      step: 2,
      title: "Connexion",
      description: "Accédez à votre espace personnel",
      icon: <Key size={32} className="text-white" />,
      color: "bg-purple-500",
      textColor: "text-purple-500"
    },
    {
      step: 3,
      title: "Vérification",
      description: "Téléversez votre permis de conduire",
      icon: <FileCheck size={32} className="text-white" />,
      color: "bg-green-500",
      textColor: "text-green-500"
    },
    {
      step: 4,
      title: "Location",
      description: "Choisissez et louez votre véhicule",
      icon: <Car size={32} className="text-white" />,
      color: "bg-orange-500",
      textColor: "text-orange-500"
    }
  ]

  return (
    <div className="py-12 md:py-16">
      <motion.div 
        className="max-w-6xl mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Comment ça <span className="text-blue-600">fonctionne</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Ligne de connexion dégradée */}
          <div className="hidden md:block absolute top-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 via-green-500 to-orange-500 z-1" style={{ width: '100%' }}></div>
          
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              className="relative z-20"
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div className="bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 b rounded-2xl p-6 text-center h-full shadow-md hover:shadow-xl transition-shadow duration-300">
                {/* Cercle coloré avec numéro d'étape */}
                <div className={`absolute -top-5 left-1/2 transform -translate-x-1/2 ${item.color} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md`}>
                  {item.step}
                </div>
                
                {/* Icône dans un cercle coloré */}
                <div className={`w-16 h-16 mx-auto rounded-full ${item.color} flex items-center justify-center mb-4 transform transition-transform duration-300 group-hover:scale-105`}>
                  {item.icon}
                </div>
                
                <h3 className={`text-xl font-semibold mb-2 ${item.textColor}`}>{item.title}</h3>
                <p className="text-gray-100 dark:text-gray-800">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
'use client'

import { motion } from 'framer-motion'
import { Key, Clock, CheckCircle, FileCheck } from 'lucide-react'

export default function AdvantagesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const featureVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6 } 
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 }
    }
  }

  const features = [
    { 
      icon: <Key size={24} className="text-white" />,
      title: "Réservation Rapide",
      description: "Réservez votre véhicule en quelques clics depuis notre plateforme.",
      color: "from-sky-600 to-blue-500",
      iconBg: "bg-gradient-to-r from-sky-600 to-blue-500"
    },
    { 
      icon: <Clock size={24} className="text-white" />,
      title: "Service 24/7",
      description: "Notre support client est disponible à tout moment pour vous aider.",
      color: "from-purple-600 to-violet-500",
      iconBg: "bg-gradient-to-r from-purple-600 to-violet-500"
    },
    { 
      icon: <CheckCircle size={24} className="text-white" />,
      title: "Véhicules Vérifiés",
      description: "Tous nos véhicules sont soigneusement entretenus et vérifiés.",
      color: "from-green-600 to-emerald-500",
      iconBg: "bg-gradient-to-r from-green-600 to-emerald-500"
    },
    { 
      icon: <FileCheck size={24} className="text-white" />,
      title: "Validation Facile",
      description: "Téléversez simplement votre permis pour être validé rapidement.",
      color: "from-amber-500 to-orange-500",
      iconBg: "bg-gradient-to-r from-amber-500 to-orange-500"
    }
  ]

  return (
    <div className="py-16">
      <motion.div 
        className="max-w-6xl mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Nos <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">avantages</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="relative z-10 h-full"
              variants={featureVariants}
              whileHover="hover"
            >
              <div className="bg-card hover:bg-card/80 border border-border rounded-xl p-6 h-full transition-all duration-300 relative overflow-hidden group">
                {/* Superposition de dégradé au survol */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="flex items-start">
                  <div className={`p-3 rounded-xl ${feature.iconBg} mr-5 shadow-md group-hover:shadow-lg transition-all duration-300`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      <span className={`bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                        {feature.title}
                      </span>
                    </h3>
                    <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
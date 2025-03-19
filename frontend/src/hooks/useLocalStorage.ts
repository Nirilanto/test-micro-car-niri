// src/hooks/useLocalStorage.ts
'use client'

import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // État pour stocker notre valeur
  // Passe la fonction d'initialisation à useState pour que la logique ne s'exécute qu'une fois
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    
    try {
      // Récupérer depuis localStorage
      const item = window.localStorage.getItem(key)
      // Analyser le JSON stocké ou retourner initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // Si erreur, retourner initialValue
      console.error(error)
      return initialValue
    }
  })

  // Fonction pour mettre à jour la valeur localStorage et l'état
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Autorise à utiliser une fonction pour mettre à jour la valeur
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
        
      // Sauvegarder l'état
      setStoredValue(valueToStore)
      
      // Sauvegarder dans localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(error)
    }
  }
  
  return [storedValue, setValue] as const
}